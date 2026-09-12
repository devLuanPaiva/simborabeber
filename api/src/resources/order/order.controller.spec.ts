import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderStatus } from './entities/order.entity';
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
            findThemAllByBarSlug: jest.fn(),
            findOne: jest.fn(),
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
      .compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findThemAllByBarSlug forwards the bar slug and optional status filter', () => {
    controller.findThemAllByBarSlug('bar-do-joao', OrderStatus.RECEIVED);

    expect(service.findThemAllByBarSlug).toHaveBeenCalledWith('bar-do-joao', OrderStatus.RECEIVED);
  });

  it('findOne forwards the order id', () => {
    controller.findOne('order-1');

    expect(service.findOne).toHaveBeenCalledWith('order-1');
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
