import { Test, TestingModule } from '@nestjs/testing';
import { ProductAddonController } from './product-addon.controller';
import { ProductAddonService } from './product-addon.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';

describe('ProductAddonController', () => {
  let controller: ProductAddonController;
  let service: jest.Mocked<ProductAddonService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductAddonController],
      providers: [
        {
          provide: ProductAddonService,
          useValue: {
            create: jest.fn(),
            findAllTheBarAddons: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            toggleAddonStatus: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProductAddonController>(ProductAddonController);
    service = module.get(ProductAddonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create extracts the user id from the request and forwards the payload', () => {
    const req = { user: { sub: 'user-1' } };
    const dto = { name: 'Borda Catupiry', price: 8 } as any;

    controller.create(req as any, dto);

    expect(service.create).toHaveBeenCalledWith(dto, 'user-1');
  });

  it('findAllTheBarAddons forwards the bar slug and optional category filter', () => {
    controller.findAllTheBarAddons('bar-do-joao', 'pizza');

    expect(service.findAllTheBarAddons).toHaveBeenCalledWith('bar-do-joao', 'pizza');
  });

  it('update forwards the addon id and payload', () => {
    const dto = { price: 10 } as any;

    controller.update('addon-1', dto);

    expect(service.update).toHaveBeenCalledWith('addon-1', dto);
  });

  it('remove forwards the addon id', () => {
    controller.remove('addon-1');

    expect(service.remove).toHaveBeenCalledWith('addon-1');
  });

  it('toggleAddonStatus forwards the addon id', () => {
    controller.toggleAddonStatus('addon-1');

    expect(service.toggleAddonStatus).toHaveBeenCalledWith('addon-1');
  });
});
