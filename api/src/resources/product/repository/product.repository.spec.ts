import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { ProductEntity, ProductCategory } from '../entities/product.entity';

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let productRepo: { create: jest.Mock; save: jest.Mock; find: jest.Mock; findOne: jest.Mock; preload: jest.Mock; remove: jest.Mock };

  beforeEach(async () => {
    productRepo = { create: jest.fn((p) => p), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), preload: jest.fn(), remove: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: productRepo,
        },
      ],
    }).compile();

    repository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAllByBarSlug', () => {
    const buildProduct = (name: string, price: number | string = 10): ProductEntity =>
      ({ id: name, name, price, category: ProductCategory.PIZZA, isActive: true } as unknown as ProductEntity);

    it('filters by bar slug and requests the variants relation', async () => {
      productRepo.find.mockResolvedValue([]);

      await repository.findAllByBarSlug('bar-do-joao');

      expect(productRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { bar: { slug: 'bar-do-joao' } }, relations: ['variants'] }),
      );
    });

    it('also filters by category when provided', async () => {
      productRepo.find.mockResolvedValue([]);

      await repository.findAllByBarSlug('bar-do-joao', 'pizza');

      expect(productRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { bar: { slug: 'bar-do-joao' }, category: 'pizza' } }),
      );
    });

    it('sorts results by name, accent/case-insensitively', async () => {
      productRepo.find.mockResolvedValue([buildProduct('Óleo'), buildProduct('Água'), buildProduct('Batata')]);

      const result = await repository.findAllByBarSlug('bar-do-joao');

      expect(result.map((p) => p.name)).toEqual(['Água', 'Batata', 'Óleo']);
    });

    it('normalizes decimal string prices to numbers', async () => {
      productRepo.find.mockResolvedValue([buildProduct('Calabresa', '45.90')]);

      const result = await repository.findAllByBarSlug('bar-do-joao');

      expect(result[0].price).toBe(45.9);
    });
  });

  describe('findById', () => {
    it('requests the variants relation', async () => {
      productRepo.findOne.mockResolvedValue(null);

      await repository.findById('product-1');

      expect(productRepo.findOne).toHaveBeenCalledWith({ where: { id: 'product-1' }, relations: ['variants'] });
    });
  });
});
