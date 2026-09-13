import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderRepository } from './repository/order.repository';
import { UserRepository } from '../user/repository/user.repository';
import { BarRepository } from '../bar/repository/bar.repository';
import { ProductRepository } from '../product/repository/product.repository';
import { ProductVariantRepository } from '../product-variant/repository/product-variant.repository';
import { ProductAddonRepository } from '../product-addon/repository/product-addon.repository';
import { OrderGateway } from './order.gateway';
import { OrderEntity, OrderStatus, OrderType, PaymentMethod, PaymentStatus } from './entities/order.entity';
import { UserEntity } from '../user/entities/user.entity';
import { BarEntity } from '../bar/entities/bar.entity';
import { ProductEntity, ProductCategory } from '../product/entities/product.entity';
import { ProductVariantEntity } from '../product-variant/entities/product-variant.entity';
import { ProductAddonEntity } from '../product-addon/entities/product-addon.entity';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: jest.Mocked<OrderRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let barRepository: jest.Mocked<BarRepository>;
  let productRepository: jest.Mocked<ProductRepository>;
  let productVariantRepository: jest.Mocked<ProductVariantRepository>;
  let productAddonRepository: jest.Mocked<ProductAddonRepository>;
  let orderGateway: jest.Mocked<OrderGateway>;

  const buildOrder = (overrides: Partial<OrderEntity> = {}): OrderEntity => ({
    id: 'order-1',
    type: OrderType.DELIVERY,
    status: OrderStatus.RECEIVED,
    customerName: 'João',
    customerPhone: '11999999999',
    deliveryFee: 5,
    paymentMethod: PaymentMethod.PIX,
    paymentStatus: PaymentStatus.PENDING,
    totalValue: 55,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as OrderEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            createOrder: jest.fn(),
            findThemAllByBarSlug: jest.fn(),
            findById: jest.fn(),
            findByIdWithBar: jest.fn(),
            updateOrder: jest.fn(),
            deleteOrder: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: BarRepository,
          useValue: {
            findBySlug: jest.fn(),
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
        {
          provide: OrderGateway,
          useValue: {
            notifyOrderStatusUpdated: jest.fn(),
            notifyOrderCreated: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(OrderRepository);
    userRepository = module.get(UserRepository);
    barRepository = module.get(BarRepository);
    productRepository = module.get(ProductRepository);
    productVariantRepository = module.get(ProductVariantRepository);
    productAddonRepository = module.get(ProductAddonRepository);
    orderGateway = module.get(OrderGateway);

    // Most tests exercise flat (non-pizza) products, which have no variants.
    productVariantRepository.findAllByProductId.mockResolvedValue([]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateStatus', () => {
    it('moves a RECEIVED order to PREPARING and records who attended it', async () => {
      const waiter = { id: 'user-1', name: 'Maria' } as UserEntity;
      orderRepository.findById.mockResolvedValue(buildOrder({ status: OrderStatus.RECEIVED }));
      userRepository.findById.mockResolvedValue(waiter);
      const updated = buildOrder({ status: OrderStatus.PREPARING, attendedBy: waiter });
      orderRepository.updateOrder.mockResolvedValue(updated);

      await service.updateStatus('order-1', OrderStatus.PREPARING, 'user-1');

      expect(orderRepository.updateOrder).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'order-1', status: OrderStatus.PREPARING, attendedBy: waiter }),
      );
      expect(orderGateway.notifyOrderStatusUpdated).toHaveBeenCalledWith(updated);
    });

    it('rejects jumping straight from RECEIVED to COMPLETED', async () => {
      orderRepository.findById.mockResolvedValue(buildOrder({ status: OrderStatus.RECEIVED }));

      await expect(service.updateStatus('order-1', OrderStatus.COMPLETED, 'user-1')).rejects.toBeInstanceOf(BadRequestException);
      expect(orderRepository.updateOrder).not.toHaveBeenCalled();
    });

    it('does not allow cancelling an order that is already OUT_FOR_DELIVERY', async () => {
      orderRepository.findById.mockResolvedValue(buildOrder({ status: OrderStatus.OUT_FOR_DELIVERY }));

      await expect(service.updateStatus('order-1', OrderStatus.CANCELLED, 'user-1')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('lets a PICKUP order skip OUT_FOR_DELIVERY, going straight from READY to COMPLETED', async () => {
      orderRepository.findById.mockResolvedValue(buildOrder({ status: OrderStatus.READY, type: OrderType.PICKUP }));
      orderRepository.updateOrder.mockResolvedValue(buildOrder({ status: OrderStatus.COMPLETED, type: OrderType.PICKUP }));

      await service.updateStatus('order-1', OrderStatus.COMPLETED, 'user-1');

      expect(orderRepository.updateOrder).toHaveBeenCalledWith(
        expect.objectContaining({ status: OrderStatus.COMPLETED, completedAt: expect.any(Date) }),
      );
    });

    it('requires a DELIVERY order to pass through OUT_FOR_DELIVERY before COMPLETED', async () => {
      orderRepository.findById.mockResolvedValue(buildOrder({ status: OrderStatus.READY, type: OrderType.DELIVERY }));

      await expect(service.updateStatus('order-1', OrderStatus.COMPLETED, 'user-1')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws NotFoundException when the order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(service.updateStatus('missing', OrderStatus.PREPARING, 'user-1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('createPublicOrder', () => {
    const buildBar = (overrides: Partial<BarEntity> = {}): BarEntity => ({
      id: 'bar-1',
      name: 'Bar do João',
      slug: 'bar-do-joao',
      isActive: true,
      deliveryEnabled: true,
      deliveryFee: 5,
      minOrderValue: 20,
      ...overrides,
    } as BarEntity);

    const buildProduct = (overrides: Partial<ProductEntity> = {}): ProductEntity => ({
      id: 'product-1',
      name: 'Coca-cola',
      price: 10,
      category: ProductCategory.SOFT_DRINKS,
      isActive: true,
      ...overrides,
    } as ProductEntity);

    const baseDto = (overrides: Record<string, unknown> = {}) => ({
      type: OrderType.DELIVERY,
      customerName: 'João',
      customerPhone: '11999999999',
      deliveryAddress: 'Rua das Flores, 123',
      paymentMethod: PaymentMethod.PIX,
      items: [{ productId: 'product-1', quantity: 3 }],
      ...overrides,
    });

    it('throws NotFoundException when the bar does not exist or is inactive', async () => {
      barRepository.findBySlug.mockResolvedValue(null);

      await expect(service.createPublicOrder('bar-do-joao', baseDto() as any)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ForbiddenException when the bar has not enabled delivery', async () => {
      barRepository.findBySlug.mockResolvedValue(buildBar({ deliveryEnabled: false }));

      await expect(service.createPublicOrder('bar-do-joao', baseDto() as any)).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('rejects a product that does not belong to this bar (or is inactive)', async () => {
      barRepository.findBySlug.mockResolvedValue(buildBar());
      productRepository.findByIdForBar.mockResolvedValue(null);

      await expect(service.createPublicOrder('bar-do-joao', baseDto() as any)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects a DELIVERY order below the bar minimum order value', async () => {
      barRepository.findBySlug.mockResolvedValue(buildBar({ minOrderValue: 100 }));
      productRepository.findByIdForBar.mockResolvedValue(buildProduct({ price: 10 }));

      await expect(
        service.createPublicOrder('bar-do-joao', baseDto({ items: [{ productId: 'product-1', quantity: 1 }] }) as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('never trusts price/name from the request - always resolves them from the product catalog', async () => {
      barRepository.findBySlug.mockResolvedValue(buildBar());
      productRepository.findByIdForBar.mockResolvedValue(buildProduct({ name: 'Coca-cola', price: 10 }));
      orderRepository.createOrder.mockResolvedValue(buildOrder({ id: 'order-new' }));

      await service.createPublicOrder('bar-do-joao', baseDto({ items: [{ productId: 'product-1', quantity: 3, price: 0.01, name: 'hacked' }] }) as any);

      expect(orderRepository.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [expect.objectContaining({ name: 'Coca-cola', price: 10, quantity: 3 })],
        }),
      );
    });

    it('computes totalValue as items subtotal plus the bar delivery fee for DELIVERY orders', async () => {
      barRepository.findBySlug.mockResolvedValue(buildBar({ deliveryFee: 7 }));
      productRepository.findByIdForBar.mockResolvedValue(buildProduct({ price: 10 }));
      orderRepository.createOrder.mockResolvedValue(buildOrder({ id: 'order-new' }));

      await service.createPublicOrder('bar-do-joao', baseDto({ items: [{ productId: 'product-1', quantity: 3 }] }) as any);

      expect(orderRepository.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({ deliveryFee: 7, totalValue: 37 }),
      );
    });

    it('charges no delivery fee and skips the minimum order check for PICKUP orders', async () => {
      barRepository.findBySlug.mockResolvedValue(buildBar({ minOrderValue: 100, deliveryFee: 7 }));
      productRepository.findByIdForBar.mockResolvedValue(buildProduct({ price: 10 }));
      orderRepository.createOrder.mockResolvedValue(buildOrder({ id: 'order-new' }));

      await service.createPublicOrder(
        'bar-do-joao',
        baseDto({ type: OrderType.PICKUP, deliveryAddress: undefined, items: [{ productId: 'product-1', quantity: 1 }] }) as any,
      );

      expect(orderRepository.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({ deliveryFee: 0, totalValue: 10, deliveryAddress: undefined }),
      );
    });

    it('notifies the gateway after successfully creating the order', async () => {
      barRepository.findBySlug.mockResolvedValue(buildBar());
      productRepository.findByIdForBar.mockResolvedValue(buildProduct());
      const created = buildOrder({ id: 'order-new' });
      orderRepository.createOrder.mockResolvedValue(created);

      await service.createPublicOrder('bar-do-joao', baseDto() as any);

      expect(orderGateway.notifyOrderCreated).toHaveBeenCalledWith(created);
    });

    describe('pizza sizes, flavor combos and add-ons', () => {
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

      const pizzaDto = (overrides: Record<string, unknown> = {}) =>
        baseDto({ items: [{ productId: 'product-1', quantity: 1, ...overrides }] });

      it('requires a variantId when the product has active variants', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant()]);

        await expect(service.createPublicOrder('bar-do-joao', pizzaDto() as any)).rejects.toBeInstanceOf(BadRequestException);
        expect(orderRepository.createOrder).not.toHaveBeenCalled();
      });

      it('rejects a variantId that does not belong to (or is inactive for) this product', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant({ id: 'variant-g', isActive: false })]);

        await expect(
          service.createPublicOrder('bar-do-joao', pizzaDto({ variantId: 'variant-g' }) as any),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('rejects a variantId for a product that has no variants at all', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct());
        productVariantRepository.findAllByProductId.mockResolvedValue([]);

        await expect(
          service.createPublicOrder('bar-do-joao', pizzaDto({ variantId: 'variant-g' }) as any),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('prices the item using the selected variant, ignoring the flat product.price', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar({ minOrderValue: 0 }));
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ name: 'Calabresa', price: 999, category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant({ price: 45.9 })]);
        orderRepository.createOrder.mockResolvedValue(buildOrder({ id: 'order-new' }));

        await service.createPublicOrder('bar-do-joao', pizzaDto({ variantId: 'variant-g' }) as any);

        expect(orderRepository.createOrder).toHaveBeenCalledWith(
          expect.objectContaining({
            items: [expect.objectContaining({ name: 'Calabresa (G)', price: 45.9, quantity: 1 })],
          }),
        );
      });

      it('keeps the price unchanged when a second flavor is combined (size-based pricing, not flavor-based)', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar({ minOrderValue: 0 }));
        productRepository.findByIdForBar
          .mockResolvedValueOnce(buildProduct({ id: 'product-1', name: 'Calabresa', category: ProductCategory.PIZZA }))
          .mockResolvedValueOnce(buildProduct({ id: 'product-2', name: 'Marguerita', category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId
          .mockResolvedValueOnce([buildVariant({ id: 'variant-g', price: 45.9 })])
          .mockResolvedValueOnce([buildVariant({ id: 'variant-g-2', price: 65.9 })]);
        orderRepository.createOrder.mockResolvedValue(buildOrder({ id: 'order-new' }));

        await service.createPublicOrder(
          'bar-do-joao',
          pizzaDto({ variantId: 'variant-g', extraProductId: 'product-2' }) as any,
        );

        expect(orderRepository.createOrder).toHaveBeenCalledWith(
          expect.objectContaining({
            items: [expect.objectContaining({
              name: 'Calabresa / Marguerita (G)',
              price: 45.9,
              components: [
                expect.objectContaining({ productName: 'Calabresa', variantLabel: 'G', price: 45.9 }),
                expect.objectContaining({ productName: 'Marguerita', variantLabel: 'G', price: 0 }),
              ],
            })],
          }),
        );
      });

      it('allows combining flavors regardless of numberOfSlices - that limit is purely informational now', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar({ minOrderValue: 0 }));
        productRepository.findByIdForBar
          .mockResolvedValueOnce(buildProduct({ id: 'product-1', name: 'Calabresa', category: ProductCategory.PIZZA }))
          .mockResolvedValueOnce(buildProduct({ id: 'product-2', name: 'Marguerita', category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId
          .mockResolvedValueOnce([buildVariant({ id: 'variant-g', numberOfSlices: 1 })])
          .mockResolvedValueOnce([buildVariant({ id: 'variant-g-2', numberOfSlices: 1 })]);
        orderRepository.createOrder.mockResolvedValue(buildOrder({ id: 'order-new' }));

        await service.createPublicOrder(
          'bar-do-joao',
          pizzaDto({ variantId: 'variant-g', extraProductId: 'product-2' }) as any,
        );

        expect(orderRepository.createOrder).toHaveBeenCalled();
      });

      it('rejects combining a second flavor onto a product without an active size', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct());
        productVariantRepository.findAllByProductId.mockResolvedValue([]);

        await expect(
          service.createPublicOrder(
            'bar-do-joao',
            baseDto({ items: [{ productId: 'product-1', quantity: 1, extraProductId: 'product-2' }] }) as any,
          ),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('rejects combining a product with itself as the second flavor', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant()]);

        await expect(
          service.createPublicOrder('bar-do-joao', pizzaDto({ variantId: 'variant-g', extraProductId: 'product-1' }) as any),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('rejects a second flavor that is not available in the chosen size', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar());
        productRepository.findByIdForBar
          .mockResolvedValueOnce(buildProduct({ id: 'product-1', category: ProductCategory.PIZZA }))
          .mockResolvedValueOnce(buildProduct({ id: 'product-2', name: 'Marguerita', category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId
          .mockResolvedValueOnce([buildVariant({ id: 'variant-g', label: 'G' })])
          .mockResolvedValueOnce([buildVariant({ id: 'variant-m-2', label: 'M' })]);

        await expect(
          service.createPublicOrder('bar-do-joao', pizzaDto({ variantId: 'variant-g', extraProductId: 'product-2' }) as any),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('adds add-on prices on top of the variant price', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar({ minOrderValue: 0 }));
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant({ price: 45.9 })]);
        productAddonRepository.findAllByIdsForBar.mockResolvedValue([buildAddon({ price: 8 })]);
        orderRepository.createOrder.mockResolvedValue(buildOrder({ id: 'order-new' }));

        await service.createPublicOrder(
          'bar-do-joao',
          pizzaDto({ variantId: 'variant-g', addonIds: ['addon-1'] }) as any,
        );

        expect(orderRepository.createOrder).toHaveBeenCalledWith(
          expect.objectContaining({
            items: [expect.objectContaining({
              price: 53.9,
              addons: [expect.objectContaining({ name: 'Borda Catupiry', price: 8 })],
            })],
          }),
        );
      });

      it('rejects an add-on id that does not belong to this bar', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant()]);
        productAddonRepository.findAllByIdsForBar.mockResolvedValue([]);

        await expect(
          service.createPublicOrder('bar-do-joao', pizzaDto({ variantId: 'variant-g', addonIds: ['missing-addon'] }) as any),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('rejects an inactive add-on', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant()]);
        productAddonRepository.findAllByIdsForBar.mockResolvedValue([buildAddon({ isActive: false })]);

        await expect(
          service.createPublicOrder('bar-do-joao', pizzaDto({ variantId: 'variant-g', addonIds: ['addon-1'] }) as any),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('rejects an add-on restricted to a category that does not match the product', async () => {
        barRepository.findBySlug.mockResolvedValue(buildBar());
        productRepository.findByIdForBar.mockResolvedValue(buildProduct({ category: ProductCategory.PIZZA }));
        productVariantRepository.findAllByProductId.mockResolvedValue([buildVariant()]);
        productAddonRepository.findAllByIdsForBar.mockResolvedValue([buildAddon({ category: ProductCategory.DRINKS })]);

        await expect(
          service.createPublicOrder('bar-do-joao', pizzaDto({ variantId: 'variant-g', addonIds: ['addon-1'] }) as any),
        ).rejects.toBeInstanceOf(BadRequestException);
      });
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when the order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('never leaks attendedBy fields beyond id/name', async () => {
      orderRepository.findById.mockResolvedValue(
        buildOrder({ attendedBy: { id: 'user-1', name: 'Maria', password: 'hashed' } as UserEntity }),
      );

      const result = await service.findOne('order-1');

      expect(result.attendedBy).toEqual({ id: 'user-1', name: 'Maria' });
    });
  });

  describe('findOnePublicView', () => {
    it('throws NotFoundException when the order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(service.findOnePublicView('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('never exposes attendedBy or other administrative fields', async () => {
      orderRepository.findById.mockResolvedValue(
        buildOrder({ attendedBy: { id: 'user-1', name: 'Maria', password: 'hashed' } as UserEntity }),
      );

      const result = await service.findOnePublicView('order-1');

      expect(result).not.toHaveProperty('attendedBy');
      expect(result.id).toBe('order-1');
      expect(result.items).toEqual([]);
    });
  });
});
