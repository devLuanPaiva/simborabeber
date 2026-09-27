import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductVariantRepository } from './product-variant.repository';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { ProductEntity } from '../../product/entities/product.entity';

describe('ProductVariantRepository', () => {
  let repository: ProductVariantRepository;
  let variantRepo: { create: jest.Mock; save: jest.Mock; find: jest.Mock; findOne: jest.Mock; preload: jest.Mock; remove: jest.Mock };
  let productRepo: { findOne: jest.Mock };
  let manager: { transaction: jest.Mock; getRepository: jest.Mock };

  beforeEach(async () => {
    variantRepo = { create: jest.fn((v) => v), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), preload: jest.fn(), remove: jest.fn() };
    productRepo = { findOne: jest.fn() };

    manager = {
      getRepository: jest.fn((entity) => (entity === ProductEntity ? productRepo : variantRepo)),
      transaction: jest.fn(async (cb: (manager: unknown) => unknown) => cb(manager)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductVariantRepository,
        {
          provide: getRepositoryToken(ProductVariantEntity),
          useValue: { ...variantRepo, manager },
        },
      ],
    }).compile();

    repository = module.get<ProductVariantRepository>(ProductVariantRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createVariant', () => {
    it('throws NotFoundException when the product does not exist', async () => {
      productRepo.findOne.mockResolvedValue(null);

      await expect(repository.createVariant('missing-product', { label: 'G', price: 45.9 })).rejects.toBeInstanceOf(NotFoundException);
      expect(variantRepo.save).not.toHaveBeenCalled();
    });

    it('attaches the resolved product before saving the new variant', async () => {
      const product = { id: 'product-1' } as ProductEntity;
      productRepo.findOne.mockResolvedValue(product);
      variantRepo.save.mockImplementation((v) => Promise.resolve({ id: 'variant-1', ...v }));

      const result = await repository.createVariant('product-1', { label: 'G', price: 45.9 });

      expect(variantRepo.create).toHaveBeenCalledWith(expect.objectContaining({ label: 'G', price: 45.9, product }));
      expect(result.id).toBe('variant-1');
      expect(result.label).toBe('G');
    });
  });

  describe('updateVariant', () => {
    it('throws NotFoundException when the variant does not exist', async () => {
      variantRepo.preload.mockResolvedValue(undefined);

      await expect(repository.updateVariant('missing', { price: 50 })).rejects.toBeInstanceOf(NotFoundException);
      expect(variantRepo.save).not.toHaveBeenCalled();
    });

    it('saves the preloaded entity with the changes merged in', async () => {
      const preloaded = { id: 'variant-1', label: 'G', price: 50 } as ProductVariantEntity;
      variantRepo.preload.mockResolvedValue(preloaded);
      variantRepo.save.mockResolvedValue(preloaded);

      const result = await repository.updateVariant('variant-1', { price: 50 });

      expect(variantRepo.save).toHaveBeenCalledWith(preloaded);
      expect(result.price).toBe(50);
    });
  });

  describe('deleteVariant', () => {
    it('throws NotFoundException when the variant does not exist', async () => {
      variantRepo.findOne.mockResolvedValue(null);

      await expect(repository.deleteVariant('missing')).rejects.toBeInstanceOf(NotFoundException);
      expect(variantRepo.remove).not.toHaveBeenCalled();
    });

    it('removes the variant once found', async () => {
      const variant = { id: 'variant-1' } as ProductVariantEntity;
      variantRepo.findOne.mockResolvedValue(variant);

      await repository.deleteVariant('variant-1');

      expect(variantRepo.remove).toHaveBeenCalledWith(variant);
    });
  });
});
