import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../user/repository/user.repository';
import { TabRepository } from '../tab/repository/tab.repository';
import { TabItemEntity } from './entities/tab-item.entity';

@WebSocketGateway({ namespace: 'tab-item' })
@Injectable()
export class TabItemGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TabItemGateway.name);

  private readonly socketMap = new Map<string, { userId: string; barId?: string }>()

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly tabRepository: TabRepository,
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
        this.logger.verbose(`Conexão (socket ${client.id})`);
        client.disconnect(true);
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

  private roomName(barId: string) {
    return `bar:${barId}`;
  }

  async notifyItemAdded(tabId: string, item: TabItemEntity) {
    const tab = await this.tabRepository.findByIdWithBar(tabId);
    const barId = tab?.bar?.id;
    if (!barId) return;
    this.server.to(this.roomName(barId)).emit('tab_item_added', { tabId, item });
  }

  async notifyItemsAdded(tabId: string, items: TabItemEntity[]) {
    const tab = await this.tabRepository.findByIdWithBar(tabId);
    const barId = tab?.bar?.id;
    if (!barId) return;
    this.server.to(this.roomName(barId)).emit('tab_items_added', { tabId, items, count: items.length });
  }

  async notifyItemUpdated(tabId: string, item: TabItemEntity) {
    const tab = await this.tabRepository.findByIdWithBar(tabId);
    const barId = tab?.bar?.id;
    if (!barId) return;
    this.server.to(this.roomName(barId)).emit('tab_item_updated', { tabId, item });
  }

  async notifyItemDeleted(tabId: string, itemId: string) {
    const tab = await this.tabRepository.findByIdWithBar(tabId);
    const barId = tab?.bar?.id;
    if (!barId) return;
    this.server.to(this.roomName(barId)).emit('tab_item_deleted', { tabId, itemId });
  }

}
