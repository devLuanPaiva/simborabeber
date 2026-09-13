import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderStatus, OrderType, PaymentMethod } from './entities/order.entity';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createPublicOrder: jest.fn(),
            findThemAllByBarSlug: jest.fn(),
            findOne: jest.fn(),
            findOnePublicView: jest.fn(),
            updateStatus: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createByBarSlug forwards the bar slug and the order payload', () => {
    const dto = {
      type: OrderType.PICKUP,
      customerName: 'João',
      customerPhone: '11999999999',
      paymentMethod: PaymentMethod.CASH,
      items: [{ productId: 'product-1', quantity: 1 }],
    };

    controller.createByBarSlug('bar-do-joao', dto as any);

    expect(service.createPublicOrder).toHaveBeenCalledWith('bar-do-joao', dto);
  });

  it('findThemAllByBarSlug forwards the bar slug and optional status filter', () => {
    controller.findThemAllByBarSlug('bar-do-joao', OrderStatus.RECEIVED);

    expect(service.findThemAllByBarSlug).toHaveBeenCalledWith('bar-do-joao', OrderStatus.RECEIVED);
  });

  it('findOne forwards the order id', () => {
    controller.findOne('order-1');

    expect(service.findOne).toHaveBeenCalledWith('order-1');
  });

  it('findOnePublic forwards the order id to the public view', () => {
    controller.findOnePublic('order-1');

    expect(service.findOnePublicView).toHaveBeenCalledWith('order-1');
  });

  it('updateStatus extracts the user id from the request and forwards the new status', () => {
    const req = { user: { sub: 'user-1' } };

    controller.updateStatus(req as any, 'order-1', { status: OrderStatus.PREPARING });

    expect(service.updateStatus).toHaveBeenCalledWith('order-1', OrderStatus.PREPARING, 'user-1');
  });

  it('remove forwards the order id', () => {
    controller.remove('order-1');

    expect(service.remove).toHaveBeenCalledWith('order-1');
  });
});
