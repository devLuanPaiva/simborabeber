import { Injectable } from '@nestjs/common';
import { OrderItemRepository } from './repository/order-item.repository';
import { OrderGateway } from '../order/order.gateway';

@Injectable()
export class OrderItemService {

  constructor(
    private readonly orderItemRepository: OrderItemRepository,
    private readonly orderGateway: OrderGateway,
  ) { }

  findItemsByOrder(orderId: string) {
    return this.orderItemRepository.findItemsByOrder(orderId);
  }

  async updateItemQuantity(id: string, quantity: number) {
    const existing = await this.orderItemRepository.findByIdWithOrder(id);
    const orderId = existing?.order?.id;

    const updated = await this.orderItemRepository.updateItemQuantity(id, quantity);
    if (orderId) await this.orderGateway.notifyOrderItemUpdated(orderId, updated);

    return updated;
  }

  async deleteItem(id: string) {
    const existing = await this.orderItemRepository.findByIdWithOrder(id);
    const orderId = existing?.order?.id;

    await this.orderItemRepository.deleteItem(id);
    if (orderId) await this.orderGateway.notifyOrderItemDeleted(orderId, id);

    return { message: 'Item removido' };
  }
}
