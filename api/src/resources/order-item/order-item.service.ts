import { Injectable } from '@nestjs/common';
import { OrderItemRepository } from './repository/order-item.repository';

@Injectable()
export class OrderItemService {

  constructor(
    private readonly orderItemRepository: OrderItemRepository,
  ) { }

  findItemsByOrder(orderId: string) {
    return this.orderItemRepository.findItemsByOrder(orderId);
  }

  updateItemQuantity(id: string, quantity: number) {
    return this.orderItemRepository.updateItemQuantity(id, quantity);
  }

  deleteItem(id: string) {
    return this.orderItemRepository.deleteItem(id);
  }
}
