import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';

describe('ProductController', () => {
  let controller: ProductController;
  let service: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            createMany: jest.fn(),
            findAllTheBarProducts: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            toggleProductStatus: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create extracts the user id from the request and forwards the payload', () => {
    const req = { user: { sub: 'user-1' } };
    const dto = { name: 'Calabresa', price: 45.9 } as any;

    controller.create(req as any, dto);

    expect(service.create).toHaveBeenCalledWith(dto, 'user-1');
  });

  it('createMany extracts the user id from the request and forwards the payload', () => {
    const req = { user: { sub: 'user-1' } };
    const dto = { products: [{ name: 'Calabresa', price: 45.9 }] } as any;

    controller.createMany(req as any, dto);

    expect(service.createMany).toHaveBeenCalledWith(dto, 'user-1');
  });

  it('findAllTheBarProducts forwards the bar slug and optional category filter', () => {
    controller.findAllTheBarProducts('bar-do-joao', 'pizza');

    expect(service.findAllTheBarProducts).toHaveBeenCalledWith('bar-do-joao', 'pizza');
  });

  it('findOne forwards the product id', () => {
    controller.findOne('product-1');

    expect(service.findOne).toHaveBeenCalledWith('product-1');
  });

  it('update forwards the product id and payload', () => {
    const dto = { price: 50 } as any;

    controller.update('product-1', dto);

    expect(service.update).toHaveBeenCalledWith('product-1', dto);
  });

  it('remove forwards the product id', () => {
    controller.remove('product-1');

    expect(service.remove).toHaveBeenCalledWith('product-1');
  });

  it('toggleProductStatus forwards the product id', () => {
    controller.toggleProductStatus('product-1');

    expect(service.toggleProductStatus).toHaveBeenCalledWith('product-1');
  });
});
