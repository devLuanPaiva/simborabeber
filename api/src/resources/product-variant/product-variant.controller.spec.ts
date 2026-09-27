import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';

describe('ProductVariantController', () => {
  let controller: ProductVariantController;
  let service: jest.Mocked<ProductVariantService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariantController],
      providers: [
        {
          provide: ProductVariantService,
          useValue: {
            createByProduct: jest.fn(),
            findAllByProduct: jest.fn(),
            update: jest.fn(),
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

    controller = module.get<ProductVariantController>(ProductVariantController);
    service = module.get(ProductVariantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createByProduct delegates to the service with the product id from the route', () => {
    const dto = { label: 'G', price: 45.9 } as any;

    controller.createByProduct('product-1', dto);

    expect(service.createByProduct).toHaveBeenCalledWith('product-1', dto);
  });

  it('findAllByProduct delegates to the service with the product id from the route', () => {
    controller.findAllByProduct('product-1');

    expect(service.findAllByProduct).toHaveBeenCalledWith('product-1');
  });

  it('update delegates to the service with the variant id and payload', () => {
    const dto = { price: 50 } as any;

    controller.update('variant-1', dto);

    expect(service.update).toHaveBeenCalledWith('variant-1', dto);
  });

  it('remove delegates to the service with the variant id', () => {
    controller.remove('variant-1');

    expect(service.remove).toHaveBeenCalledWith('variant-1');
  });
});
