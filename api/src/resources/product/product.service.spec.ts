import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductRepository } from './repository/product.repository';
import { UserRepository } from '../user/repository/user.repository';
import { BarEntity } from '../bar/entities/bar.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ProductEntity, ProductCategory } from './entities/product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: jest.Mocked<ProductRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let barRepository: { findOne: jest.Mock };

  beforeEach(async () => {
    barRepository = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: {
            createProduct: jest.fn(),
            createProducts: jest.fn(),
            findAllByBarSlug: jest.fn(),
            findById: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
            toggleProductStatus: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findUserByIdWithBar: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(BarEntity),
          useValue: barRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(ProductRepository);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { name: 'Calabresa', price: 45.9, description: 'Molho, mussarela e calabresa', category: ProductCategory.PIZZA, image: 'https://x' };

    it('throws NotFoundException when the user does not exist', async () => {
      userRepository.findUserByIdWithBar.mockResolvedValue(null);

      await expect(service.create(dto, 'user-1')).rejects.toBeInstanceOf(NotFoundException);
      expect(productRepository.createProduct).not.toHaveBeenCalled();
    });

    it('throws ForbiddenException when the user has no bar associated', async () => {
      userRepository.findUserByIdWithBar.mockResolvedValue({ id: 'user-1', bar: null } as unknown as UserEntity);

      await expect(service.create(dto, 'user-1')).rejects.toBeInstanceOf(ForbiddenException);
      expect(productRepository.createProduct).not.toHaveBeenCalled();
    });

    it('attaches the user bar and creates the product', async () => {
      const bar = { id: 'bar-1' } as BarEntity;
      userRepository.findUserByIdWithBar.mockResolvedValue({ id: 'user-1', bar } as UserEntity);
      const created = { id: 'product-1', ...dto } as unknown as ProductEntity;
      productRepository.createProduct.mockResolvedValue(created);

      const result = await service.create(dto, 'user-1');

      expect(productRepository.createProduct).toHaveBeenCalledWith(expect.objectContaining({ ...dto, bar }));
      expect(result).toBe(created);
    });

    it('passes nested variants straight through to the repository for cascade insert', async () => {
      const bar = { id: 'bar-1' } as BarEntity;
      userRepository.findUserByIdWithBar.mockResolvedValue({ id: 'user-1', bar } as UserEntity);
      const dtoWithVariants = { ...dto, variants: [{ label: 'G', price: 45.9 }, { label: 'GG', price: 65.9 }] };
      productRepository.createProduct.mockResolvedValue({ id: 'product-1' } as ProductEntity);

      await service.create(dtoWithVariants, 'user-1');

      expect(productRepository.createProduct).toHaveBeenCalledWith(
        expect.objectContaining({ variants: dtoWithVariants.variants }),
      );
    });
  });

  describe('findAllTheBarProducts', () => {
    it('throws NotFoundException when the bar does not exist', async () => {
      barRepository.findOne.mockResolvedValue(null);

      await expect(service.findAllTheBarProducts('bar-do-joao')).rejects.toBeInstanceOf(NotFoundException);
      expect(productRepository.findAllByBarSlug).not.toHaveBeenCalled();
    });

    it('delegates to the repository once the bar is confirmed to exist', async () => {
      barRepository.findOne.mockResolvedValue({ id: 'bar-1', slug: 'bar-do-joao' } as BarEntity);
      const products = [{ id: 'product-1' } as ProductEntity];
      productRepository.findAllByBarSlug.mockResolvedValue(products);

      const result = await service.findAllTheBarProducts('bar-do-joao', 'pizza');

      expect(productRepository.findAllByBarSlug).toHaveBeenCalledWith('bar-do-joao', 'pizza');
      expect(result).toBe(products);
    });
  });

  describe('update', () => {
    it('delegates to the repository with the product id and payload', async () => {
      const updated = { id: 'product-1', price: 50 } as ProductEntity;
      productRepository.updateProduct.mockResolvedValue(updated);

      const result = await service.update('product-1', { price: 50 } as any);

      expect(productRepository.updateProduct).toHaveBeenCalledWith('product-1', { price: 50 });
      expect(result).toBe(updated);
    });
  });
});
