import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../user/repository/user.repository';
import { OrderRepository } from './repository/order.repository';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from '../order-item/entities/order-item.entity';

@WebSocketGateway({ namespace: 'order' })
@Injectable()
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OrderGateway.name);

  private readonly socketMap = new Map<string, { userId: string; barId?: string }>()

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
  ) { }

  async handleConnection(client: Socket) {
    try {
      const token = (client.handshake.auth && (client.handshake.auth.token || client.handshake.auth.Authorization)) || client.handshake.headers?.authorization;
      let rawToken: string | undefined;
      if (typeof token === 'string') {
        if (token.startsWith('Bearer ')) rawToken = token.split(' ')[1];
        else rawToken = token;
      } else if (typeof token === 'object' && token?.token) {
        rawToken = token.token;
      }

      if (!rawToken) {
        this.logger.verbose(`Conexão anônima (socket ${client.id}) - aguardando join_order`);
        return;
      }

      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(rawToken, { secret });
      if (!payload?.sub) {
        client.disconnect(true);
        return;
      }

      const user = await this.userRepository.findUserByIdWithBar(payload.sub);
      const barId = user?.bar?.id;

      this.socketMap.set(client.id, { userId: payload.sub, barId });

      if (barId) {
        client.join(this.roomName(barId));
        this.logger.verbose(`Socket ${client.id} joined bar room ${barId}`);
      }
    } catch (err: unknown) {
      this.logger.warn(`Erro na conexão do socket ${client.id}: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    this.socketMap.delete(client.id);
  }

  @SubscribeMessage('join_order')
  handleJoinOrder(@ConnectedSocket() client: Socket, @MessageBody() orderId: unknown) {
    if (typeof orderId !== 'string' || !orderId) return;
    client.join(this.orderRoomName(orderId));
    this.logger.verbose(`Socket ${client.id} joined order room ${orderId}`);
  }

  private roomName(barId: string) {
    return `bar:${barId}`;
  }

  private orderRoomName(orderId: string) {
    return `order:${orderId}`;
  }

  /**
   * Never broadcast the raw OrderEntity: it carries `attendedBy` (including the
   * staff member's hashed password) and the full `bar` relation. The `order:<id>`
   * room is joined by anonymous customers via `join_order`, so this shape is the
   * only thing allowed over the wire, staff and customers alike.
   */
  private shapeForBroadcast(order: OrderEntity) {
    return {
      id: order.id,
      type: order.type,
      status: order.status,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      deliveryFee: order.deliveryFee,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      notes: order.notes,
      totalValue: order.totalValue,
      items: (order.items ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes,
        category: item.category,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      readyAt: order.readyAt,
      completedAt: order.completedAt,
      cancelledAt: order.cancelledAt,
    };
  }

  async notifyOrderCreated(order: OrderEntity) {
    const barId = order.bar?.id;
    if (!barId) return;
    this.server.to(this.roomName(barId)).emit('order_created', { order: this.shapeForBroadcast(order) });
  }

  async notifyOrderStatusUpdated(order: OrderEntity) {
    const withBar = order.bar?.id ? order : await this.orderRepository.findByIdWithBar(order.id);
    const barId = withBar?.bar?.id;
    const payload = { order: this.shapeForBroadcast(order) };
    if (barId) this.server.to(this.roomName(barId)).emit('order_status_updated', payload);
    this.server.to(this.orderRoomName(order.id)).emit('order_status_updated', payload);
  }

  async notifyOrderItemUpdated(orderId: string, item: OrderItemEntity) {
    const order = await this.orderRepository.findByIdWithBar(orderId);
    const barId = order?.bar?.id;
    if (barId) this.server.to(this.roomName(barId)).emit('order_item_updated', { orderId, item });
    this.server.to(this.orderRoomName(orderId)).emit('order_item_updated', { orderId, item });
  }

  async notifyOrderItemDeleted(orderId: string, itemId: string) {
    const order = await this.orderRepository.findByIdWithBar(orderId);
    const barId = order?.bar?.id;
    if (barId) this.server.to(this.roomName(barId)).emit('order_item_deleted', { orderId, itemId });
    this.server.to(this.orderRoomName(orderId)).emit('order_item_deleted', { orderId, itemId });
  }
}
