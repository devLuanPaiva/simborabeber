import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OrderGateway } from './order.gateway';
import { OrderRepository } from './repository/order.repository';
import { UserRepository } from '../user/repository/user.repository';
import { OrderEntity } from './entities/order.entity';
import { BarEntity } from '../bar/entities/bar.entity';

describe('OrderGateway', () => {
  let gateway: OrderGateway;
  let orderRepository: jest.Mocked<OrderRepository>;
  let emit: jest.Mock;
  let to: jest.Mock;

  beforeEach(async () => {
    emit = jest.fn();
    to = jest.fn(() => ({ emit }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderGateway,
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: UserRepository, useValue: { findUserByIdWithBar: jest.fn() } },
        { provide: OrderRepository, useValue: { findByIdWithBar: jest.fn() } },
      ],
    }).compile();

    gateway = module.get<OrderGateway>(OrderGateway);
    orderRepository = module.get(OrderRepository);
    (gateway as unknown as { server: { to: jest.Mock } }).server = { to };
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('emits order_created to the bar room when the order already carries its bar', async () => {
    const order = { id: 'order-1', bar: { id: 'bar-1' } as BarEntity } as OrderEntity;

    await gateway.notifyOrderCreated(order);

    expect(to).toHaveBeenCalledWith('bar:bar-1');
    expect(emit).toHaveBeenCalledWith('order_created', { order });
  });

  it('does not emit order_created when the order has no bar resolved', async () => {
    await gateway.notifyOrderCreated({ id: 'order-1' } as OrderEntity);

    expect(to).not.toHaveBeenCalled();
  });

  it('resolves the bar from the repository for order_status_updated when not already loaded', async () => {
    const order = { id: 'order-1' } as OrderEntity;
    orderRepository.findByIdWithBar.mockResolvedValue({ id: 'order-1', bar: { id: 'bar-2' } as BarEntity } as OrderEntity);

    await gateway.notifyOrderStatusUpdated(order);

    expect(orderRepository.findByIdWithBar).toHaveBeenCalledWith('order-1');
    expect(to).toHaveBeenCalledWith('bar:bar-2');
    expect(emit).toHaveBeenCalledWith('order_status_updated', { order });
  });

  it('emits order_item_updated in the room of the item order bar', async () => {
    orderRepository.findByIdWithBar.mockResolvedValue({ id: 'order-1', bar: { id: 'bar-3' } as BarEntity } as OrderEntity);

    await gateway.notifyOrderItemUpdated('order-1', { id: 'item-1' } as any);

    expect(to).toHaveBeenCalledWith('bar:bar-3');
    expect(emit).toHaveBeenCalledWith('order_item_updated', { orderId: 'order-1', item: { id: 'item-1' } });
  });

  it('does not emit order_item_deleted when the order cannot be resolved', async () => {
    orderRepository.findByIdWithBar.mockResolvedValue(null);

    await gateway.notifyOrderItemDeleted('missing-order', 'item-1');

    expect(to).not.toHaveBeenCalled();
  });
});
