import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderItemRepository } from './order-item.repository';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderEntity, OrderStatus } from '../../order/entities/order.entity';

describe('OrderItemRepository', () => {
  let repository: OrderItemRepository;
  let orderItemRepo: { findOne: jest.Mock; save: jest.Mock; delete: jest.Mock };
  let orderRepo: { save: jest.Mock };
  let manager: { transaction: jest.Mock; getRepository: jest.Mock };

  beforeEach(async () => {
    orderItemRepo = { findOne: jest.fn(), save: jest.fn(), delete: jest.fn() };
    orderRepo = { save: jest.fn() };

    manager = {
      getRepository: jest.fn((entity) => (entity === OrderEntity ? orderRepo : orderItemRepo)),
      transaction: jest.fn(async (cb: (manager: unknown) => unknown) => cb(manager)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemRepository,
        {
          provide: getRepositoryToken(OrderItemEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            manager,
          },
        },
      ],
    }).compile();

    repository = module.get<OrderItemRepository>(OrderItemRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('updateItemQuantity', () => {
    it('recalculates the order total when the order is still RECEIVED', async () => {
      const order = { id: 'order-1', status: OrderStatus.RECEIVED, totalValue: 50 } as OrderEntity;
      const item = { id: 'item-1', price: 10, quantity: 2, order } as OrderItemEntity;

      orderItemRepo.findOne.mockResolvedValue(item);
      orderItemRepo.save.mockImplementation((i) => Promise.resolve(i));

      await repository.updateItemQuantity('item-1', 5);

      expect(orderRepo.save).toHaveBeenCalledWith(expect.objectContaining({ id: 'order-1', totalValue: 80 }));
    });

    it('rejects the change once the order has moved past PREPARING', async () => {
      const order = { id: 'order-1', status: OrderStatus.READY, totalValue: 50 } as OrderEntity;
      const item = { id: 'item-1', price: 10, quantity: 2, order } as OrderItemEntity;

      orderItemRepo.findOne.mockResolvedValue(item);

      await expect(repository.updateItemQuantity('item-1', 5)).rejects.toBeInstanceOf(BadRequestException);
      expect(orderRepo.save).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when the item does not exist', async () => {
      orderItemRepo.findOne.mockResolvedValue(null);

      await expect(repository.updateItemQuantity('missing', 1)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('deleteItem', () => {
    it('subtracts the item value from the order total and deletes it', async () => {
      const order = { id: 'order-1', status: OrderStatus.PREPARING, totalValue: 50 } as OrderEntity;
      const item = { id: 'item-1', price: 10, quantity: 2, order } as OrderItemEntity;

      orderItemRepo.findOne.mockResolvedValue(item);

      await repository.deleteItem('item-1');

      expect(orderRepo.save).toHaveBeenCalledWith(expect.objectContaining({ id: 'order-1', totalValue: 30 }));
      expect(orderItemRepo.delete).toHaveBeenCalledWith('item-1');
    });

    it('never lets the order total go negative', async () => {
      const order = { id: 'order-1', status: OrderStatus.PREPARING, totalValue: 5 } as OrderEntity;
      const item = { id: 'item-1', price: 10, quantity: 2, order } as OrderItemEntity;

      orderItemRepo.findOne.mockResolvedValue(item);

      await repository.deleteItem('item-1');

      expect(orderRepo.save).toHaveBeenCalledWith(expect.objectContaining({ totalValue: 0 }));
    });

    it('rejects deleting an item once the order is READY or further', async () => {
      const order = { id: 'order-1', status: OrderStatus.COMPLETED, totalValue: 50 } as OrderEntity;
      const item = { id: 'item-1', price: 10, quantity: 2, order } as OrderItemEntity;

      orderItemRepo.findOne.mockResolvedValue(item);

      await expect(repository.deleteItem('item-1')).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
