import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './repository/order.repository';
import { UserRepository } from '../user/repository/user.repository';
import { BarRepository } from '../bar/repository/bar.repository';
import { ProductRepository } from '../product/repository/product.repository';
import { ProductVariantRepository } from '../product-variant/repository/product-variant.repository';
import { ProductVariantEntity } from '../product-variant/entities/product-variant.entity';
import { ProductAddonRepository } from '../product-addon/repository/product-addon.repository';
import { OrderGateway } from './order.gateway';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';
import { CreatePublicOrderItemDto } from './dto/create-public-order-item.dto';
import { OrderEntity, OrderStatus, OrderType, PaymentStatus } from './entities/order.entity';
import { OrderItemEntity } from '../order-item/entities/order-item.entity';
import { BarEntity } from '../bar/entities/bar.entity';

type NextStatusResolver = (order: OrderEntity) => OrderStatus[];

const NEXT_STATUSES: Record<OrderStatus, NextStatusResolver> = {
  [OrderStatus.RECEIVED]: () => [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: () => [OrderStatus.READY, OrderStatus.CANCELLED],
  [OrderStatus.READY]: (order) =>
    order.type === OrderType.DELIVERY ? [OrderStatus.OUT_FOR_DELIVERY] : [OrderStatus.COMPLETED],
  [OrderStatus.OUT_FOR_DELIVERY]: () => [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: () => [],
  [OrderStatus.CANCELLED]: () => [],
};

@Injectable()
export class OrderService {

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly barRepository: BarRepository,
    private readonly productRepository: ProductRepository,
    private readonly productVariantRepository: ProductVariantRepository,
    private readonly productAddonRepository: ProductAddonRepository,
    private readonly orderGateway: OrderGateway,
  ) { }

  async createPublicOrder(slug: string, dto: CreatePublicOrderDto) {
    const bar = await this.barRepository.findBySlug(slug);
    if (!bar?.isActive) {
      throw new NotFoundException({ message: 'Bar não encontrado', field: 'slug', detail: `Bar com slug "${slug}" não foi encontrado` });
    }

    if (!bar.deliveryEnabled) {
      throw new ForbiddenException({ message: 'Delivery indisponível', field: 'deliveryEnabled', detail: `O bar "${bar.name}" não está aceitando pedidos de delivery no momento` });
    }

    const items: Partial<OrderItemEntity>[] = [];
    for (const itemDto of dto.items) {
      items.push(await this.resolveOrderItem(itemDto, bar));
    }

    const subtotal = items.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
    const deliveryFee = dto.type === OrderType.DELIVERY ? Number(bar.deliveryFee || 0) : 0;

    if (dto.type === OrderType.DELIVERY && subtotal < Number(bar.minOrderValue || 0)) {
      throw new BadRequestException({
        message: 'Pedido mínimo não atingido',
        field: 'items',
        detail: `O pedido mínimo para entrega neste bar é de ${bar.minOrderValue}`,
      });
    }

    const orderData: Partial<OrderEntity> = {
      type: dto.type,
      status: OrderStatus.RECEIVED,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      deliveryAddress: dto.type === OrderType.DELIVERY ? dto.deliveryAddress : undefined,
      deliveryFee,
      paymentMethod: dto.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      notes: dto.notes,
      totalValue: subtotal + deliveryFee,
      bar,
      items: items as OrderItemEntity[],
    };

    const created = await this.orderRepository.createOrder(orderData);
    await this.orderGateway.notifyOrderCreated(created);
    return this.shapeOrder(created);
  }

  /**
   * Resolves a single order item into its snapshot, including the chosen
   * size (variant), an optional second flavor and any paid add-ons.
   *
   * Pricing rule (confirmed with the pizzeria client): the unit price is
   * driven only by the primary product's variant (the size) - a second
   * flavor never changes the price, since in this business flavors don't
   * carry their own cost, only sizes do. Add-ons are summed on top.
   */
  private async resolveOrderItem(itemDto: CreatePublicOrderItemDto, bar: BarEntity): Promise<Partial<OrderItemEntity>> {
    const product = await this.productRepository.findByIdForBar(itemDto.productId, bar.id);
    if (!product?.isActive) {
      throw new BadRequestException({ message: 'Produto inválido', field: 'items', detail: `O produto informado não foi encontrado no cardápio deste bar` });
    }

    const variants = await this.productVariantRepository.findAllByProductId(product.id);
    const activeVariants = variants.filter((v) => v.isActive);

    let variant: ProductVariantEntity | null = null;
    if (activeVariants.length > 0) {
      if (!itemDto.variantId) {
        throw new BadRequestException({ message: 'Tamanho é obrigatório', field: 'variantId', detail: `Selecione um tamanho para "${product.name}"` });
      }
      variant = activeVariants.find((v) => v.id === itemDto.variantId) ?? null;
      if (!variant) {
        throw new BadRequestException({ message: 'Tamanho inválido', field: 'variantId', detail: `O tamanho informado não está disponível para "${product.name}"` });
      }
    } else if (itemDto.variantId) {
      throw new BadRequestException({ message: 'Produto sem tamanhos', field: 'variantId', detail: `"${product.name}" não possui tamanhos configurados` });
    }

    const unitPrice = variant ? variant.price : product.price;

    const components: Partial<OrderItemEntity['components'][number]>[] = [{
      product,
      productName: product.name,
      variantLabel: variant?.label ?? null,
      price: unitPrice,
    }];

    let name = product.name;

    if (itemDto.extraProductId) {
      if (itemDto.extraProductId === itemDto.productId) {
        throw new BadRequestException({ message: 'Sabores repetidos', field: 'extraProductId', detail: 'Escolha dois sabores diferentes' });
      }
      if (!variant || variant.maxFlavors < 2) {
        throw new BadRequestException({ message: 'Combinação não permitida', field: 'extraProductId', detail: `Este tamanho não permite combinar sabores` });
      }

      const extraProduct = await this.productRepository.findByIdForBar(itemDto.extraProductId, bar.id);
      if (!extraProduct?.isActive) {
        throw new BadRequestException({ message: 'Sabor inválido', field: 'extraProductId', detail: `O segundo sabor informado não foi encontrado no cardápio deste bar` });
      }

      const extraVariants = await this.productVariantRepository.findAllByProductId(extraProduct.id);
      const matchingExtraVariant = extraVariants.find((v) => v.isActive && v.label === variant.label);
      if (!matchingExtraVariant) {
        throw new BadRequestException({ message: 'Sabor indisponível neste tamanho', field: 'extraProductId', detail: `"${extraProduct.name}" não está disponível no tamanho ${variant.label}` });
      }

      components.push({
        product: extraProduct,
        productName: extraProduct.name,
        variantLabel: matchingExtraVariant.label,
        price: 0,
      });
      name = `${product.name} / ${extraProduct.name}`;
    }

    if (variant) {
      name = `${name} (${variant.label})`;
    }

    let addonTotal = 0;
    const addonComponents: Partial<OrderItemEntity['addons'][number]>[] = [];
    if (itemDto.addonIds?.length) {
      const addons = await this.productAddonRepository.findAllByIdsForBar(itemDto.addonIds, bar.id);
      if (addons.length !== itemDto.addonIds.length) {
        throw new BadRequestException({ message: 'Adicional inválido', field: 'addonIds', detail: 'Um ou mais adicionais informados não foram encontrados no cardápio deste bar' });
      }
      for (const addon of addons) {
        if (!addon.isActive) {
          throw new BadRequestException({ message: 'Adicional indisponível', field: 'addonIds', detail: `O adicional "${addon.name}" não está disponível` });
        }
        if (addon.category && addon.category !== product.category) {
          throw new BadRequestException({ message: 'Adicional incompatível', field: 'addonIds', detail: `O adicional "${addon.name}" não é válido para este produto` });
        }
        addonTotal += Number(addon.price);
        addonComponents.push({ addon, name: addon.name, price: addon.price });
      }
    }

    return {
      name,
      price: Number(unitPrice) + addonTotal,
      quantity: itemDto.quantity,
      notes: itemDto.notes,
      category: product.category,
      components: components as OrderItemEntity['components'],
      addons: addonComponents as OrderItemEntity['addons'],
    };
  }

  async findThemAllByBarSlug(slug: string, status?: OrderStatus) {
    const orders = await this.orderRepository.findThemAllByBarSlug(slug, status);
    return orders.map((order) => this.shapeOrder(order));
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException({ message: 'Pedido não encontrado', field: 'id', detail: `Pedido com id ${id} não foi encontrado` });
    }
    return this.shapeOrder(order);
  }

  async findOnePublicView(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException({ message: 'Pedido não encontrado', field: 'id', detail: `Pedido com id ${id} não foi encontrado` });
    }

    return {
      id: order.id,
      type: order.type,
      status: order.status,
      customerName: order.customerName,
      deliveryAddress: order.deliveryAddress,
      deliveryFee: order.deliveryFee,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      notes: order.notes,
      totalValue: order.totalValue,
      items: this.shapeItems(order.items),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      readyAt: order.readyAt,
      completedAt: order.completedAt,
      cancelledAt: order.cancelledAt,
    };
  }

  async updateStatus(id: string, status: OrderStatus, userId: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException({ message: 'Pedido não encontrado', field: 'id', detail: `Pedido com id ${id} não foi encontrado` });
    }

    const allowedNext = NEXT_STATUSES[order.status](order);
    if (!allowedNext.includes(status)) {
      throw new BadRequestException({
        message: 'Transição de status inválida',
        field: 'status',
        detail: `Não é possível mudar o pedido de "${order.status}" para "${status}"`,
      });
    }

    const patch: Partial<OrderEntity> = { id, status };

    if (status === OrderStatus.PREPARING) {
      const user = await this.userRepository.findById(userId);
      if (user) patch.attendedBy = user;
    }
    if (status === OrderStatus.READY) patch.readyAt = new Date();
    if (status === OrderStatus.COMPLETED) patch.completedAt = new Date();
    if (status === OrderStatus.CANCELLED) patch.cancelledAt = new Date();

    const updated = await this.orderRepository.updateOrder(patch);
    await this.orderGateway.notifyOrderStatusUpdated(updated);
    return this.shapeOrder(updated);
  }

  remove(id: string) {
    return this.orderRepository.deleteOrder(id);
  }

  private shapeItems(items: OrderItemEntity[] | undefined) {
    return (items ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      notes: item.notes,
      category: item.category,
      ...(item.components?.length ? {
        components: item.components.map((c) => ({ productName: c.productName, variantLabel: c.variantLabel, price: c.price })),
      } : {}),
      ...(item.addons?.length ? {
        addons: item.addons.map((a) => ({ name: a.name, price: a.price })),
      } : {}),
    }));
  }

  private shapeOrder(order: OrderEntity) {
    const attendedBy = order.attendedBy ? { id: order.attendedBy.id, name: order.attendedBy.name } : undefined;

    return {
      id: order.id,
      type: order.type,
      status: order.status,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      deliveryFee: order.deliveryFee,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      notes: order.notes,
      totalValue: order.totalValue,
      items: this.shapeItems(order.items),
      attendedBy,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      readyAt: order.readyAt,
      completedAt: order.completedAt,
      cancelledAt: order.cancelledAt,
    };
  }
}
