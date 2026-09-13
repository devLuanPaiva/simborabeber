import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OrderGateway } from './order.gateway';
import { OrderRepository } from './repository/order.repository';
import { UserRepository } from '../user/repository/user.repository';
import { OrderEntity, OrderStatus, OrderType, PaymentMethod, PaymentStatus } from './entities/order.entity';
import { BarEntity } from '../bar/entities/bar.entity';
import { UserEntity } from '../user/entities/user.entity';

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

  describe('handleConnection', () => {
    it('keeps an anonymous connection open instead of disconnecting it', async () => {
      const disconnect = jest.fn();
      const client = {
        id: 'socket-1',
        handshake: { auth: {}, headers: {} },
        disconnect,
        join: jest.fn(),
      } as any;

      await gateway.handleConnection(client);

      expect(disconnect).not.toHaveBeenCalled();
    });
  });

  describe('handleJoinOrder', () => {
    it('joins the room for the given order id', () => {
      const join = jest.fn();
      const client = { id: 'socket-1', join } as any;

      gateway.handleJoinOrder(client, 'order-1');

      expect(join).toHaveBeenCalledWith('order:order-1');
    });

    it('ignores a non-string payload instead of joining a malformed room', () => {
      const join = jest.fn();
      const client = { id: 'socket-1', join } as any;

      gateway.handleJoinOrder(client, { orderId: 'order-1' });

      expect(join).not.toHaveBeenCalled();
    });
  });

  const buildOrder = (overrides: Partial<OrderEntity> = {}): OrderEntity => ({
    id: 'order-1',
    type: OrderType.PICKUP,
    status: OrderStatus.RECEIVED,
    customerName: 'João',
    customerPhone: '11999999999',
    deliveryFee: 0,
    paymentMethod: PaymentMethod.CASH,
    paymentStatus: PaymentStatus.PENDING,
    totalValue: 20,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as OrderEntity);

  it('emits order_created to the bar room when the order already carries its bar', async () => {
    const order = buildOrder({ bar: { id: 'bar-1' } as BarEntity });

    await gateway.notifyOrderCreated(order);

    expect(to).toHaveBeenCalledWith('bar:bar-1');
    expect(emit).toHaveBeenCalledWith('order_created', { order: expect.objectContaining({ id: 'order-1' }) });
  });

  it('does not emit order_created when the order has no bar resolved', async () => {
    await gateway.notifyOrderCreated(buildOrder());

    expect(to).not.toHaveBeenCalled();
  });

  it('emits order_status_updated to both the bar room and the order room', async () => {
    const order = buildOrder();
    orderRepository.findByIdWithBar.mockResolvedValue(buildOrder({ bar: { id: 'bar-2' } as BarEntity }));

    await gateway.notifyOrderStatusUpdated(order);

    expect(orderRepository.findByIdWithBar).toHaveBeenCalledWith('order-1');
    expect(to).toHaveBeenCalledWith('bar:bar-2');
    expect(to).toHaveBeenCalledWith('order:order-1');
    expect(emit).toHaveBeenCalledWith('order_status_updated', { order: expect.objectContaining({ id: 'order-1' }) });
  });

  it('never broadcasts attendedBy (and its password hash) or the raw bar relation - the order:<id> room is joined by anonymous customers', async () => {
    const staffMember = {
      id: 'user-1',
      name: 'Maria',
      password: '$2b$10$hashedsecret',
    } as UserEntity;
    const order = buildOrder({
      attendedBy: staffMember,
      bar: { id: 'bar-1', name: 'Bar do João' } as BarEntity,
    });

    await gateway.notifyOrderStatusUpdated(order);

    const [, broadcastPayload] = emit.mock.calls[0];
    expect(broadcastPayload.order).not.toHaveProperty('attendedBy');
    expect(broadcastPayload.order).not.toHaveProperty('bar');
    expect(JSON.stringify(broadcastPayload)).not.toContain('hashedsecret');
  });

  it('still notifies the order room for order_status_updated even when the bar cannot be resolved', async () => {
    orderRepository.findByIdWithBar.mockResolvedValue(null);

    await gateway.notifyOrderStatusUpdated(buildOrder());

    expect(to).toHaveBeenCalledWith('order:order-1');
    expect(to).not.toHaveBeenCalledWith(expect.stringMatching(/^bar:/));
  });

  it('emits order_item_updated to both the bar room and the order room', async () => {
    orderRepository.findByIdWithBar.mockResolvedValue({ id: 'order-1', bar: { id: 'bar-3' } as BarEntity } as OrderEntity);

    await gateway.notifyOrderItemUpdated('order-1', { id: 'item-1' } as any);

    expect(to).toHaveBeenCalledWith('bar:bar-3');
    expect(to).toHaveBeenCalledWith('order:order-1');
    expect(emit).toHaveBeenCalledWith('order_item_updated', { orderId: 'order-1', item: { id: 'item-1' } });
  });

  it('still notifies the order room for order_item_deleted even when the order cannot be resolved', async () => {
    orderRepository.findByIdWithBar.mockResolvedValue(null);

    await gateway.notifyOrderItemDeleted('missing-order', 'item-1');

    expect(to).toHaveBeenCalledWith('order:missing-order');
    expect(to).not.toHaveBeenCalledWith(expect.stringMatching(/^bar:/));
  });
});
