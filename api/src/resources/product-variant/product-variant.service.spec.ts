import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantRepository } from './repository/product-variant.repository';
import { ProductVariantEntity } from './entities/product-variant.entity';

describe('ProductVariantService', () => {
  let service: ProductVariantService;
  let productVariantRepository: jest.Mocked<ProductVariantRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductVariantService,
        {
          provide: ProductVariantRepository,
          useValue: {
            createVariant: jest.fn(),
            findAllByProductId: jest.fn(),
            updateVariant: jest.fn(),
            deleteVariant: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductVariantService>(ProductVariantService);
    productVariantRepository = module.get(ProductVariantRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createByProduct delegates to the repository with the product id and payload', async () => {
    const dto = { label: 'G', price: 45.9 };
    const created = { id: 'variant-1', ...dto } as ProductVariantEntity;
    productVariantRepository.createVariant.mockResolvedValue(created);

    const result = await service.createByProduct('product-1', dto as any);

    expect(productVariantRepository.createVariant).toHaveBeenCalledWith('product-1', dto);
    expect(result).toBe(created);
  });

  it('findAllByProduct delegates to the repository', async () => {
    const variants = [{ id: 'variant-1' } as ProductVariantEntity];
    productVariantRepository.findAllByProductId.mockResolvedValue(variants);

    const result = await service.findAllByProduct('product-1');

    expect(productVariantRepository.findAllByProductId).toHaveBeenCalledWith('product-1');
    expect(result).toBe(variants);
  });

  it('update delegates to the repository', async () => {
    const updated = { id: 'variant-1', price: 50 } as ProductVariantEntity;
    productVariantRepository.updateVariant.mockResolvedValue(updated);

    const result = await service.update('variant-1', { price: 50 } as any);

    expect(productVariantRepository.updateVariant).toHaveBeenCalledWith('variant-1', { price: 50 });
    expect(result).toBe(updated);
  });

  it('remove delegates to the repository', async () => {
    await service.remove('variant-1');

    expect(productVariantRepository.deleteVariant).toHaveBeenCalledWith('variant-1');
  });
});
