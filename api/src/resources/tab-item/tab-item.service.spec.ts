import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TabItemService } from './tab-item.service';
import { TabItemsRepository } from './repository/tab-item.repository';
import { TabItemGateway } from './tab-item.gateway';
import { TabRepository } from '../tab/repository/tab.repository';
import { ProductRepository } from '../product/repository/product.repository';
import { ProductVariantRepository } from '../product-variant/repository/product-variant.repository';
import { ProductAddonRepository } from '../product-addon/repository/product-addon.repository';
import { TabEntity, TabStatus } from '../tab/entities/tab.entity';
import { BarEntity } from '../bar/entities/bar.entity';
import { ProductEntity, ProductCategory } from '../product/entities/product.entity';
import { ProductVariantEntity } from '../product-variant/entities/product-variant.entity';
import { ProductAddonEntity } from '../product-addon/entities/product-addon.entity';
import { TabItemEntity } from './entities/tab-item.entity';

describe('TabItemService', () => {
  let service: TabItemService;
  let tabItemRepository: jest.Mocked<TabItemsRepository>;
  let tabItemGateway: jest.Mocked<TabItemGateway>;
  let tabRepository: jest.Mocked<TabRepository>;
  let productRepository: jest.Mocked<ProductRepository>;
  let productVariantRepository: jest.Mocked<ProductVariantRepository>;
  let productAddonRepository: jest.Mocked<ProductAddonRepository>;

  const buildBar = (overrides: Partial<BarEntity> = {}): BarEntity => ({
    id: 'bar-1',
    name: 'Bar do João',
    slug: 'bar-do-joao',
    isActive: true,
    ...overrides,
  } as BarEntity);

  const buildTab = (overrides: Partial<TabEntity> = {}): TabEntity => ({
    id: 'tab-1',
    status: TabStatus.OPEN,
    totalValue: 0,
    bar: buildBar(),
    ...overrides,
  } as TabEntity);

  const buildProduct = (overrides: Partial<ProductEntity> = {}): ProductEntity => ({
    id: 'product-1',
    name: 'Coca-cola',
    price: 10,
    category: ProductCategory.SOFT_DRINKS,
    isActive: true,
    ...overrides,
  } as ProductEntity);

  const buildVariant = (overrides: Partial<ProductVariantEntity> = {}): ProductVariantEntity => ({
    id: 'variant-g',
    label: 'G',
    price: 45.9,
    sortOrder: 0,
    numberOfSlices: 8,
    isActive: true,
    ...overrides,
  } as ProductVariantEntity);

  const buildAddon = (overrides: Partial<ProductAddonEntity> = {}): ProductAddonEntity => ({
    id: 'addon-1',
    name: 'Borda Catupiry',
    price: 8,
    category: null,
    isActive: true,
    ...overrides,
  } as ProductAddonEntity);

  const buildTabItem = (overrides: Partial<TabItemEntity> = {}): TabItemEntity => ({
    id: 'tab-item-1',
    name: 'Coca-cola',
    price: 10,
    quantity: 1,
    category: ProductCategory.SOFT_DRINKS,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as TabItemEntity);

  const baseDto = (overrides: Record<string, unknown> = {}) => ({
    productId: 'product-1',
    quantity: 1,
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TabItemService,
        {
          provide: TabItemsRepository,
          useValue: {
            createItemByTab: jest.fn(),
            createItemsByTab: jest.fn(),
            findItemsByTab: jest.fn(),
            updateItemQuantity: jest.fn(),
            deleteItem: jest.fn(),
            findByIdWithTab: jest.fn(),
          },
        },
        {
          provide: TabItemGateway,
          useValue: {
            notifyItemAdded: jest.fn(),
            notifyItemsAdded: jest.fn(),
            notifyItemUpdated: jest.fn(),
            notifyItemDeleted: jest.fn(),
          },
        },
        {
          provide: TabRepository,
          useValue: {
            findByIdWithBar: jest.fn(),
          },
        },
        {
          provide: ProductRepository,
          useValue: {
            findByIdForBar: jest.fn(),
          },
        },
        {
          provide: ProductVariantRepository,
          useValue: {
            findAllByProductId: jest.fn(),
          },
        },
        {
          provide: ProductAddonRepository,
          useValue: {
            findAllByIdsForBar: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TabItemService>(TabItemService);
    tabItemRepository = module.get(TabItemsRepository);
    tabItemGateway = module.get(TabItemGateway);
    tabRepository = module.get(TabRepository);
    productRepository = module.get(ProductRepository);
    productVariantRepository = module.get(ProductVariantRepository);
    productAddonRepository = module.get(ProductAddonRepository);

    // Most tests exercise flat (non-pizza) products, which have no variants.
    productVariantRepository.findAllByProductId.mockResolvedValue([]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createItemByTab', () => {
    it('throws NotFoundException when the tab does not exist', async () => {
      tabRepository.findByIdWithBar.mockResolvedValue(null);

      await expect(service.createItemByTab('tab-1', baseDto() as any, 'user-1')).rejects.toBeInstanceOf(NotFoundException);
      expect(tabItemRepository.createItemByTab).not.toHaveBeenCalled();
    });

    it('rejects a product that does not belong to this bar (or is inactive)', async () => {
      tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
      productRepository.findByIdForBar.mockResolvedValue(null);

      await expect(service.createItemByTab('tab-1', baseDto() as any, 'user-1')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('never trusts price/name from the request - always resolves them from the product catalog', async () => {
      tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
      productRepository.findByIdForBar.mockResolvedValue(buildProduct({ name: 'Coca-cola', price: 10 }));
      tabItemRepository.createItemByTab.mockResolvedValue(buildTabItem());

      await service.createItemByTab('tab-1', baseDto({ price: 0.01, name: 'hacked' }) as any, 'user-1');

      expect(tabItemRepository.createItemByTab).toHaveBeenCalledWith(
        'tab-1',
        expect.objectContaining({ name: 'Coca-cola', price: 10, quantity: 1 }),
        'user-1',
      );
    });

    it('notifies the gateway after successfully creating the item', async () => {
      tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
      productRepository.findByIdForBar.mockResolvedValue(buildProduct());
      const created = buildTabItem();
      tabItemRepository.createItemByTab.mockResolvedValue(created);

      await service.createItemByTab('tab-1', baseDto() as any, 'user-1');

      expect(tabItemGateway.notifyItemAdded).toHaveBeenCalledWith('tab-1', created);
    });

    describe('pizza sizes, flavor combos and add-ons', () => {
      const pizzaDto = (overrides: Record<string, unknown> = {}) => baseDto(overrides);

      it('requires a variantId when the product has active variants', async () => {
        tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant()]);

        await expect(service.createItemByTab('tab-1', pizzaDto() as any, 'user-1')).rejects.toBeInstanceOf(BadRequestException);
        expect(tabItemRepository.createItemByTab).not.toHaveBeenCalled();
      });

      it('rejects a variantId that does not belong to (or is inactive for) this product', async () => {
        tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant({ isActive: false })]);

        await expect(
          service.createItemByTab('tab-1', pizzaDto({ variantId: 'variant-g' }) as any, 'user-1'),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('prices the item using the selected variant, ignoring the flat product.price', async () => {
        tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ name: 'Calabresa', price: 999, category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant({ price: 45.9 })]);
        tabItemRepository.createItemByTab.mockResolvedValue(buildTabItem());

        await service.createItemByTab('tab-1', pizzaDto({ variantId: 'variant-g' }) as any, 'user-1');

        expect(tabItemRepository.createItemByTab).toHaveBeenCalledWith(
          'tab-1',
          expect.objectContaining({ name: 'Calabresa (G)', price: 45.9, quantity: 1 }),
          'user-1',
        );
      });

      it('keeps the price unchanged when a second flavor is combined (size-based pricing, not flavor-based)', async () => {
        tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
        productRepository.findByIdForBar
          .mockResolvedValueOnce(buildProduct({ id: 'product-1', name: 'Calabresa', category: ProductCategory.PIZZA }))
          .mockResolvedValueOnce(buildProduct({ id: 'product-2', name: 'Marguerita', category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId
          .mockResolvedValueOnce([buildVariant({ id: 'variant-g', price: 45.9 })])
          .mockResolvedValueOnce([buildVariant({ id: 'variant-g-2', price: 65.9 })]);
        tabItemRepository.createItemByTab.mockResolvedValue(buildTabItem());

        await service.createItemByTab(
          'tab-1',
          pizzaDto({ variantId: 'variant-g', extraProductId: 'product-2' }) as any,
          'user-1',
        );

        expect(tabItemRepository.createItemByTab).toHaveBeenCalledWith(
          'tab-1',
          expect.objectContaining({
            name: 'Calabresa / Marguerita (G)',
            price: 45.9,
            components: [
              expect.objectContaining({ productName: 'Calabresa', variantLabel: 'G', price: 45.9 }),
              expect.objectContaining({ productName: 'Marguerita', variantLabel: 'G', price: 0 }),
            ],
          }),
          'user-1',
        );
      });

      it('rejects combining a second flavor onto a product without an active size', async () => {
        tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct());
        productVariantRepository.findAllByProductId.mockResolvedValue([]);

        await expect(
          service.createItemByTab('tab-1', pizzaDto({ extraProductId: 'product-2' }) as any, 'user-1'),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('rejects combining a product with itself as the second flavor', async () => {
        tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant()]);

        await expect(
          service.createItemByTab('tab-1', pizzaDto({ variantId: 'variant-g', extraProductId: 'product-1' }) as any, 'user-1'),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('adds add-on prices on top of the variant price', async () => {
        tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant({ price: 45.9 })]);
        productAddonRepository.findAllByIdsForBar.mockResolvedValue([buildAddon({ price: 8 })]);
        tabItemRepository.createItemByTab.mockResolvedValue(buildTabItem());

        await service.createItemByTab('tab-1', pizzaDto({ variantId: 'variant-g', addonIds: ['addon-1'] }) as any, 'user-1');

        expect(tabItemRepository.createItemByTab).toHaveBeenCalledWith(
          'tab-1',
          expect.objectContaining({
            price: 53.9,
            addons: [expect.objectContaining({ name: 'Borda Catupiry', price: 8 })],
          }),
          'user-1',
        );
      });

      it('rejects an add-on id that does not belong to this bar', async () => {
        tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant()]);
        productAddonRepository.findAllByIdsForBar.mockResolvedValue([]);

        await expect(
          service.createItemByTab('tab-1', pizzaDto({ variantId: 'variant-g', addonIds: ['missing-addon'] }) as any, 'user-1'),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('rejects an add-on restricted to a category that does not match the product', async () => {
        tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant()]);
        productAddonRepository.findAllByIdsForBar.mockResolvedValue([buildAddon({ category: ProductCategory.DRINKS })]);

        await expect(
          service.createItemByTab('tab-1', pizzaDto({ variantId: 'variant-g', addonIds: ['addon-1'] }) as any, 'user-1'),
        ).rejects.toBeInstanceOf(BadRequestException);
      });
    });
  });

  describe('createItemsByTab', () => {
    it('resolves every item against the tab bar and notifies the gateway once', async () => {
      tabRepository.findByIdWithBar.mockResolvedValue(buildTab());
      productRepository.findByIdForBar
        .mockResolvedValueOnce(buildProduct({ id: 'product-1', name: 'Coca-cola' }))
        .mockResolvedValueOnce(buildProduct({ id: 'product-2', name: 'Guaraná' }));
      const created = [buildTabItem({ id: 'item-1' }), buildTabItem({ id: 'item-2' })];
      tabItemRepository.createItemsByTab.mockResolvedValue(created);

      await service.createItemsByTab(
        'tab-1',
        { items: [baseDto() as any, baseDto({ productId: 'product-2' }) as any] },
        'user-1',
      );

      expect(tabItemRepository.createItemsByTab).toHaveBeenCalledWith(
        'tab-1',
        [
          expect.objectContaining({ name: 'Coca-cola' }),
          expect.objectContaining({ name: 'Guaraná' }),
        ],
        'user-1',
      );
      expect(tabItemGateway.notifyItemsAdded).toHaveBeenCalledWith('tab-1', created);
    });
  });

  describe('updateItemQuantity', () => {
    it('notifies the gateway with the updated item', async () => {
      const updated = buildTabItem({ tab: { id: 'tab-1' } as TabEntity, quantity: 3 });
      tabItemRepository.updateItemQuantity.mockResolvedValue(updated);

      await service.updateItemQuantity('tab-item-1', 3);

      expect(tabItemGateway.notifyItemUpdated).toHaveBeenCalledWith('tab-1', updated);
    });
  });

  describe('deleteItem', () => {
    it('notifies the gateway with the tab id from before deletion', async () => {
      tabItemRepository.findByIdWithTab.mockResolvedValue(buildTabItem({ tab: { id: 'tab-1' } as TabEntity }));

      await service.deleteItem('tab-item-1');

      expect(tabItemRepository.deleteItem).toHaveBeenCalledWith('tab-item-1');
      expect(tabItemGateway.notifyItemDeleted).toHaveBeenCalledWith('tab-1', 'tab-item-1');
    });
  });
});
