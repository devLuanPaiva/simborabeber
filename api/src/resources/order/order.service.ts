import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './repository/order.repository';
import { UserRepository } from '../user/repository/user.repository';
import { BarRepository } from '../bar/repository/bar.repository';
import { ProductRepository } from '../product/repository/product.repository';
import { OrderGateway } from './order.gateway';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';
import { OrderEntity, OrderStatus, OrderType, PaymentStatus } from './entities/order.entity';
import { OrderItemEntity } from '../order-item/entities/order-item.entity';

type NextStatusResolver = (order: OrderEntity) => OrderStatus[];

const NEXT_STATUSES: Record<OrderStatus, NextStatusResolver> = {
  [OrderStatus.RECEIVED]: () => [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: () => [OrderStatus.READY, OrderStatus.CANCELLED],
  [OrderStatus.READY]: (order) =>
    order.type === OrderType.DELIVERY ? [OrderStatus.OUT_FOR_DELIVERY] : [OrderStatus.COMPLETED],
  [OrderStatus.OUT_FOR_DELIVERY]: () => [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: () => [],
  [OrderStatus.CANCELLED]: () => [],
};

@Injectable()
export class OrderService {

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly barRepository: BarRepository,
    private readonly productRepository: ProductRepository,
    private readonly orderGateway: OrderGateway,
  ) { }

  async createPublicOrder(slug: string, dto: CreatePublicOrderDto) {
    const bar = await this.barRepository.findBySlug(slug);
    if (!bar?.isActive) {
      throw new NotFoundException({ message: 'Bar não encontrado', field: 'slug', detail: `Bar com slug "${slug}" não foi encontrado` });
    }

    if (!bar.deliveryEnabled) {
      throw new ForbiddenException({ message: 'Delivery indisponível', field: 'deliveryEnabled', detail: `O bar "${bar.name}" não está aceitando pedidos de delivery no momento` });
    }

    const items: Partial<OrderItemEntity>[] = [];
    for (const itemDto of dto.items) {
      const product = await this.productRepository.findByIdForBar(itemDto.productId, bar.id);
      if (!product?.isActive) {
        throw new BadRequestException({ message: 'Produto inválido', field: 'items', detail: `O produto informado não foi encontrado no cardápio deste bar` });
      }

      items.push({
        name: product.name,
        price: product.price,
        quantity: itemDto.quantity,
        notes: itemDto.notes,
        category: product.category,
      });
    }

    const subtotal = items.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
    const deliveryFee = dto.type === OrderType.DELIVERY ? Number(bar.deliveryFee || 0) : 0;

    if (dto.type === OrderType.DELIVERY && subtotal < Number(bar.minOrderValue || 0)) {
      throw new BadRequestException({
        message: 'Pedido mínimo não atingido',
        field: 'items',
        detail: `O pedido mínimo para entrega neste bar é de ${bar.minOrderValue}`,
      });
    }

    const orderData: Partial<OrderEntity> = {
      type: dto.type,
      status: OrderStatus.RECEIVED,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      deliveryAddress: dto.type === OrderType.DELIVERY ? dto.deliveryAddress : undefined,
      deliveryFee,
      paymentMethod: dto.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      notes: dto.notes,
      totalValue: subtotal + deliveryFee,
      bar,
      items: items as OrderItemEntity[],
    };

    const created = await this.orderRepository.createOrder(orderData);
    await this.orderGateway.notifyOrderCreated(created);
    return this.shapeOrder(created);
  }

  async findThemAllByBarSlug(slug: string, status?: OrderStatus) {
    const orders = await this.orderRepository.findThemAllByBarSlug(slug, status);
    return orders.map((order) => this.shapeOrder(order));
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException({ message: 'Pedido não encontrado', field: 'id', detail: `Pedido com id ${id} não foi encontrado` });
    }
    return this.shapeOrder(order);
  }

  async updateStatus(id: string, status: OrderStatus, userId: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException({ message: 'Pedido não encontrado', field: 'id', detail: `Pedido com id ${id} não foi encontrado` });
    }

    const allowedNext = NEXT_STATUSES[order.status](order);
    if (!allowedNext.includes(status)) {
      throw new BadRequestException({
        message: 'Transição de status inválida',
        field: 'status',
        detail: `Não é possível mudar o pedido de "${order.status}" para "${status}"`,
      });
    }

    const patch: Partial<OrderEntity> = { id, status };

    if (status === OrderStatus.PREPARING) {
      const user = await this.userRepository.findById(userId);
      if (user) patch.attendedBy = user;
    }
    if (status === OrderStatus.READY) patch.readyAt = new Date();
    if (status === OrderStatus.COMPLETED) patch.completedAt = new Date();
    if (status === OrderStatus.CANCELLED) patch.cancelledAt = new Date();

    const updated = await this.orderRepository.updateOrder(patch);
    await this.orderGateway.notifyOrderStatusUpdated(updated);
    return this.shapeOrder(updated);
  }

  remove(id: string) {
    return this.orderRepository.deleteOrder(id);
  }

  private shapeOrder(order: OrderEntity) {
    const attendedBy = order.attendedBy ? { id: order.attendedBy.id, name: order.attendedBy.name } : undefined;
    const items = (order.items ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      notes: item.notes,
      category: item.category,
    }));

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
      items,
      attendedBy,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      readyAt: order.readyAt,
      completedAt: order.completedAt,
      cancelledAt: order.cancelledAt,
    };
  }
}
