import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';

describe('OrderItemController', () => {
  let controller: OrderItemController;
  let service: jest.Mocked<OrderItemService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [
        {
          provide: OrderItemService,
          useValue: {
            findItemsByOrder: jest.fn(),
            updateItemQuantity: jest.fn(),
            deleteItem: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrderItemController>(OrderItemController);
    service = module.get(OrderItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findItemsByOrder forwards the order id', () => {
    controller.findItemsByOrder('order-1');

    expect(service.findItemsByOrder).toHaveBeenCalledWith('order-1');
  });

  it('updateItemQuantity forwards the item id and new quantity', () => {
    controller.updateItemQuantity('item-1', { quantity: 3 });

    expect(service.updateItemQuantity).toHaveBeenCalledWith('item-1', 3);
  });

  it('deleteItem forwards the item id', () => {
    controller.deleteItem('item-1');

    expect(service.deleteItem).toHaveBeenCalledWith('item-1');
  });
});
