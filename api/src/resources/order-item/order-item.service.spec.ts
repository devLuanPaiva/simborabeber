import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from './order-item.service';
import { OrderItemRepository } from './repository/order-item.repository';
import { OrderGateway } from '../order/order.gateway';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderEntity } from '../order/entities/order.entity';

describe('OrderItemService', () => {
  let service: OrderItemService;
  let orderItemRepository: jest.Mocked<OrderItemRepository>;
  let orderGateway: jest.Mocked<OrderGateway>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        {
          provide: OrderItemRepository,
          useValue: {
            findItemsByOrder: jest.fn(),
            findByIdWithOrder: jest.fn(),
            updateItemQuantity: jest.fn(),
            deleteItem: jest.fn(),
          },
        },
        {
          provide: OrderGateway,
          useValue: {
            notifyOrderItemUpdated: jest.fn(),
            notifyOrderItemDeleted: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderItemService>(OrderItemService);
    orderItemRepository = module.get(OrderItemRepository);
    orderGateway = module.get(OrderGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateItemQuantity', () => {
    it('notifies the gateway with the order id resolved before the update', async () => {
      orderItemRepository.findByIdWithOrder.mockResolvedValue({
        id: 'item-1',
        order: { id: 'order-1' } as OrderEntity,
      } as OrderItemEntity);
      const updated = { id: 'item-1', quantity: 3 } as OrderItemEntity;
      orderItemRepository.updateItemQuantity.mockResolvedValue(updated);

      await service.updateItemQuantity('item-1', 3);

      expect(orderGateway.notifyOrderItemUpdated).toHaveBeenCalledWith('order-1', updated);
    });

    it('does not notify when the item/order cannot be resolved', async () => {
      orderItemRepository.findByIdWithOrder.mockResolvedValue(null);
      orderItemRepository.updateItemQuantity.mockResolvedValue({ id: 'item-1' } as OrderItemEntity);

      await service.updateItemQuantity('item-1', 3);

      expect(orderGateway.notifyOrderItemUpdated).not.toHaveBeenCalled();
    });
  });

  describe('deleteItem', () => {
    it('resolves the order id before deleting, so the notification still knows where to go', async () => {
      orderItemRepository.findByIdWithOrder.mockResolvedValue({
        id: 'item-1',
        order: { id: 'order-1' } as OrderEntity,
      } as OrderItemEntity);

      await service.deleteItem('item-1');

      expect(orderItemRepository.deleteItem).toHaveBeenCalledWith('item-1');
      expect(orderGateway.notifyOrderItemDeleted).toHaveBeenCalledWith('order-1', 'item-1');
    });
  });
});
