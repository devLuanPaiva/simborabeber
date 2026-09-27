import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTabItemDto } from './dto/create-tab-item.dto';
import { TabItemsRepository } from './repository/tab-item.repository';
import { TabItemGateway } from './tab-item.gateway';
import { TabRepository } from '../tab/repository/tab.repository';
import { ProductRepository } from '../product/repository/product.repository';
import { ProductVariantRepository } from '../product-variant/repository/product-variant.repository';
import { ProductVariantEntity } from '../product-variant/entities/product-variant.entity';
import { ProductAddonRepository } from '../product-addon/repository/product-addon.repository';
import { TabItemEntity } from './entities/tab-item.entity';
import { BarEntity } from '../bar/entities/bar.entity';

@Injectable()
export class TabItemService {

  constructor(
    private readonly tabItemRepository: TabItemsRepository,
    private readonly tabItemGateway: TabItemGateway,
    private readonly tabRepository: TabRepository,
    private readonly productRepository: ProductRepository,
    private readonly productVariantRepository: ProductVariantRepository,
    private readonly productAddonRepository: ProductAddonRepository,
  ) { }

  async createItemByTab(tabId: string, createTabItemDto: CreateTabItemDto, userId: string) {
    const bar = await this.findTabBar(tabId);
    const resolved = await this.resolveTabItem(createTabItemDto, bar);

    const created = await this.tabItemRepository.createItemByTab(tabId, resolved, userId);
    await this.tabItemGateway.notifyItemAdded(tabId, created);
    return created;
  }

  async createItemsByTab(tabId: string, createManyDto: { items: CreateTabItemDto[] }, userId: string) {
    const bar = await this.findTabBar(tabId);
    const resolvedItems: Partial<TabItemEntity>[] = [];
    for (const itemDto of createManyDto.items) {
      resolvedItems.push(await this.resolveTabItem(itemDto, bar));
    }

    const created = await this.tabItemRepository.createItemsByTab(tabId, resolvedItems, userId);
    await this.tabItemGateway.notifyItemsAdded(tabId, created);
    return created;
  }

  async findItemsByTab(tabId: string) {
    return this.tabItemRepository.findItemsByTab(tabId);
  }

  async updateItemQuantity(id: string, quantity: number) {
    const updated = await this.tabItemRepository.updateItemQuantity(id, quantity);
    const tabId = updated.tab?.id;
    if (tabId) await this.tabItemGateway.notifyItemUpdated(tabId, updated);
    return updated;
  }

  async deleteItem(id: string) {
    const item = await this.tabItemRepository.findByIdWithTab(id);
    const tabId = item?.tab?.id;
    await this.tabItemRepository.deleteItem(id);
    if (tabId) await this.tabItemGateway.notifyItemDeleted(tabId, id);
    return { message: 'Item removed' };
  }

  private async findTabBar(tabId: string): Promise<BarEntity> {
    const tab = await this.tabRepository.findByIdWithBar(tabId);
    if (!tab?.bar) {
      throw new NotFoundException({ message: 'Comanda não encontrada', field: 'tabId', detail: `Comanda com id ${tabId} não foi encontrada` });
    }
    return tab.bar;
  }

  /**
   * Resolves a tab item into its snapshot, mirroring the same size/second
   * flavor/add-ons rules used for public delivery orders (order.service.ts),
   * so a pizza rings up the same way whether it's ordered for delivery or
   * added to a comanda by a waiter.
   */
  private async resolveTabItem(itemDto: CreateTabItemDto, bar: BarEntity): Promise<Partial<TabItemEntity>> {
    const product = await this.productRepository.findByIdForBar(itemDto.productId, bar.id);
    if (!product?.isActive) {
      throw new BadRequestException({ message: 'Produto inválido', field: 'productId', detail: `O produto informado não foi encontrado no cardápio deste bar` });
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
    if (unitPrice === null || unitPrice === undefined) {
      throw new BadRequestException({ message: 'Produto sem preço configurado', field: 'productId', detail: `"${product.name}" não possui um preço configurado` });
    }

    const components: Partial<TabItemEntity['components'][number]>[] = [{
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
      if (!variant) {
        throw new BadRequestException({ message: 'Combinação não permitida', field: 'extraProductId', detail: `Selecione um tamanho para combinar sabores` });
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
    const addonComponents: Partial<TabItemEntity['addons'][number]>[] = [];
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
      components: components as TabItemEntity['components'],
      addons: addonComponents as TabItemEntity['addons'],
    };
  }
}
