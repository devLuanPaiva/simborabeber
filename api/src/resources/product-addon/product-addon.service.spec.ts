import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProductAddonService } from './product-addon.service';
import { ProductAddonRepository } from './repository/product-addon.repository';
import { UserRepository } from '../user/repository/user.repository';
import { BarEntity } from '../bar/entities/bar.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ProductAddonEntity } from './entities/product-addon.entity';

describe('ProductAddonService', () => {
  let service: ProductAddonService;
  let productAddonRepository: jest.Mocked<ProductAddonRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let barRepository: { findOne: jest.Mock };

  beforeEach(async () => {
    barRepository = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductAddonService,
        {
          provide: ProductAddonRepository,
          useValue: {
            createAddon: jest.fn(),
            findAllByBarSlug: jest.fn(),
            updateAddon: jest.fn(),
            deleteAddon: jest.fn(),
            toggleAddonStatus: jest.fn(),
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

    service = module.get<ProductAddonService>(ProductAddonService);
    productAddonRepository = module.get(ProductAddonRepository);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { name: 'Borda Catupiry', price: 8 };

    it('throws NotFoundException when the user does not exist', async () => {
      userRepository.findUserByIdWithBar.mockResolvedValue(null);

      await expect(service.create(dto, 'user-1')).rejects.toBeInstanceOf(NotFoundException);
      expect(productAddonRepository.createAddon).not.toHaveBeenCalled();
    });

    it('throws ForbiddenException when the user has no bar associated', async () => {
      userRepository.findUserByIdWithBar.mockResolvedValue({ id: 'user-1', bar: null } as unknown as UserEntity);

      await expect(service.create(dto, 'user-1')).rejects.toBeInstanceOf(ForbiddenException);
      expect(productAddonRepository.createAddon).not.toHaveBeenCalled();
    });

    it('attaches the user bar and creates the addon', async () => {
      const bar = { id: 'bar-1' } as BarEntity;
      userRepository.findUserByIdWithBar.mockResolvedValue({ id: 'user-1', bar } as UserEntity);
      const created = { id: 'addon-1', ...dto } as ProductAddonEntity;
      productAddonRepository.createAddon.mockResolvedValue(created);

      const result = await service.create(dto, 'user-1');

      expect(productAddonRepository.createAddon).toHaveBeenCalledWith(expect.objectContaining({ ...dto, bar }));
      expect(result).toBe(created);
    });
  });

  describe('findAllTheBarAddons', () => {
    it('throws NotFoundException when the bar does not exist', async () => {
      barRepository.findOne.mockResolvedValue(null);

      await expect(service.findAllTheBarAddons('bar-do-joao')).rejects.toBeInstanceOf(NotFoundException);
      expect(productAddonRepository.findAllByBarSlug).not.toHaveBeenCalled();
    });

    it('delegates to the repository once the bar is confirmed to exist', async () => {
      barRepository.findOne.mockResolvedValue({ id: 'bar-1', slug: 'bar-do-joao' } as BarEntity);
      const addons = [{ id: 'addon-1' } as ProductAddonEntity];
      productAddonRepository.findAllByBarSlug.mockResolvedValue(addons);

      const result = await service.findAllTheBarAddons('bar-do-joao', 'pizza');

      expect(productAddonRepository.findAllByBarSlug).toHaveBeenCalledWith('bar-do-joao', 'pizza');
      expect(result).toBe(addons);
    });
  });
});
