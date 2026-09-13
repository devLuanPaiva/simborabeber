import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductAddonRepository } from './product-addon.repository';
import { ProductAddonEntity } from '../entities/product-addon.entity';

describe('ProductAddonRepository', () => {
  let repository: ProductAddonRepository;
  let addonRepo: { create: jest.Mock; save: jest.Mock; find: jest.Mock; findOne: jest.Mock; preload: jest.Mock; remove: jest.Mock };

  beforeEach(async () => {
    addonRepo = { create: jest.fn((a) => a), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), preload: jest.fn(), remove: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductAddonRepository,
        {
          provide: getRepositoryToken(ProductAddonEntity),
          useValue: addonRepo,
        },
      ],
    }).compile();

    repository = module.get<ProductAddonRepository>(ProductAddonRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAllByIdsForBar', () => {
    it('short-circuits without querying when no ids are given', async () => {
      const result = await repository.findAllByIdsForBar([], 'bar-1');

      expect(result).toEqual([]);
      expect(addonRepo.find).not.toHaveBeenCalled();
    });

    it('queries scoped to the given bar', async () => {
      addonRepo.find.mockResolvedValue([{ id: 'addon-1', price: '8.00' }]);

      const result = await repository.findAllByIdsForBar(['addon-1'], 'bar-1');

      expect(addonRepo.find).toHaveBeenCalledWith({ where: { id: expect.anything(), bar: { id: 'bar-1' } } });
      expect(result[0].price).toBe(8);
    });
  });

  describe('updateAddon', () => {
    it('throws NotFoundException when the addon does not exist', async () => {
      addonRepo.preload.mockResolvedValue(undefined);

      await expect(repository.updateAddon('missing', { price: 10 })).rejects.toBeInstanceOf(NotFoundException);
      expect(addonRepo.save).not.toHaveBeenCalled();
    });

    it('saves the preloaded entity with the changes merged in', async () => {
      const preloaded = { id: 'addon-1', price: 10 } as ProductAddonEntity;
      addonRepo.preload.mockResolvedValue(preloaded);
      addonRepo.save.mockResolvedValue(preloaded);

      const result = await repository.updateAddon('addon-1', { price: 10 });

      expect(addonRepo.save).toHaveBeenCalledWith(preloaded);
      expect(result.price).toBe(10);
    });
  });

  describe('deleteAddon', () => {
    it('throws NotFoundException when the addon does not exist', async () => {
      addonRepo.findOne.mockResolvedValue(null);

      await expect(repository.deleteAddon('missing')).rejects.toBeInstanceOf(NotFoundException);
      expect(addonRepo.remove).not.toHaveBeenCalled();
    });

    it('removes the addon once found', async () => {
      const addon = { id: 'addon-1' } as ProductAddonEntity;
      addonRepo.findOne.mockResolvedValue(addon);

      await repository.deleteAddon('addon-1');

      expect(addonRepo.remove).toHaveBeenCalledWith(addon);
    });
  });

  describe('toggleAddonStatus', () => {
    it('throws NotFoundException when the addon does not exist', async () => {
      addonRepo.findOne.mockResolvedValue(null);

      await expect(repository.toggleAddonStatus('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('flips isActive and saves', async () => {
      const addon = { id: 'addon-1', isActive: true } as ProductAddonEntity;
      addonRepo.findOne.mockResolvedValue(addon);
      addonRepo.save.mockImplementation((a) => Promise.resolve(a));

      const result = await repository.toggleAddonStatus('addon-1');

      expect(result.isActive).toBe(false);
    });
  });
});
