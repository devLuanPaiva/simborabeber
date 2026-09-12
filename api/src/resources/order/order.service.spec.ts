import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderRepository } from './repository/order.repository';
import { UserRepository } from '../user/repository/user.repository';
import { OrderEntity, OrderStatus, OrderType, PaymentMethod, PaymentStatus } from './entities/order.entity';
import { UserEntity } from '../user/entities/user.entity';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: jest.Mocked<OrderRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  const buildOrder = (overrides: Partial<OrderEntity> = {}): OrderEntity => ({
    id: 'order-1',
    type: OrderType.DELIVERY,
    status: OrderStatus.RECEIVED,
    customerName: 'João',
    customerPhone: '11999999999',
    deliveryFee: 5,
    paymentMethod: PaymentMethod.PIX,
    paymentStatus: PaymentStatus.PENDING,
    totalValue: 55,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as OrderEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            findThemAllByBarSlug: jest.fn(),
            findById: jest.fn(),
            findByIdWithBar: jest.fn(),
            updateOrder: jest.fn(),
            deleteOrder: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(OrderRepository);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateStatus', () => {
    it('moves a RECEIVED order to PREPARING and records who attended it', async () => {
      const waiter = { id: 'user-1', name: 'Maria' } as UserEntity;
      orderRepository.findById.mockResolvedValue(buildOrder({ status: OrderStatus.RECEIVED }));
      userRepository.findById.mockResolvedValue(waiter);
      orderRepository.updateOrder.mockResolvedValue(buildOrder({ status: OrderStatus.PREPARING, attendedBy: waiter }));

      await service.updateStatus('order-1', OrderStatus.PREPARING, 'user-1');

      expect(orderRepository.updateOrder).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'order-1', status: OrderStatus.PREPARING, attendedBy: waiter }),
      );
    });

    it('rejects jumping straight from RECEIVED to COMPLETED', async () => {
      orderRepository.findById.mockResolvedValue(buildOrder({ status: OrderStatus.RECEIVED }));

      await expect(service.updateStatus('order-1', OrderStatus.COMPLETED, 'user-1')).rejects.toBeInstanceOf(BadRequestException);
      expect(orderRepository.updateOrder).not.toHaveBeenCalled();
    });

    it('does not allow cancelling an order that is already OUT_FOR_DELIVERY', async () => {
      orderRepository.findById.mockResolvedValue(buildOrder({ status: OrderStatus.OUT_FOR_DELIVERY }));

      await expect(service.updateStatus('order-1', OrderStatus.CANCELLED, 'user-1')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('lets a PICKUP order skip OUT_FOR_DELIVERY, going straight from READY to COMPLETED', async () => {
      orderRepository.findById.mockResolvedValue(buildOrder({ status: OrderStatus.READY, type: OrderType.PICKUP }));
      orderRepository.updateOrder.mockResolvedValue(buildOrder({ status: OrderStatus.COMPLETED, type: OrderType.PICKUP }));

      await service.updateStatus('order-1', OrderStatus.COMPLETED, 'user-1');

      expect(orderRepository.updateOrder).toHaveBeenCalledWith(
        expect.objectContaining({ status: OrderStatus.COMPLETED, completedAt: expect.any(Date) }),
      );
    });

    it('requires a DELIVERY order to pass through OUT_FOR_DELIVERY before COMPLETED', async () => {
      orderRepository.findById.mockResolvedValue(buildOrder({ status: OrderStatus.READY, type: OrderType.DELIVERY }));

      await expect(service.updateStatus('order-1', OrderStatus.COMPLETED, 'user-1')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws NotFoundException when the order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(service.updateStatus('missing', OrderStatus.PREPARING, 'user-1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when the order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('never leaks attendedBy fields beyond id/name', async () => {
      orderRepository.findById.mockResolvedValue(
        buildOrder({ attendedBy: { id: 'user-1', name: 'Maria', password: 'hashed' } as UserEntity }),
      );

      const result = await service.findOne('order-1');

      expect(result.attendedBy).toEqual({ id: 'user-1', name: 'Maria' });
    });
  });
});
