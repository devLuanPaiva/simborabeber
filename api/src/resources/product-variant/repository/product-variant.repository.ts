import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductVariantEntity } from "../entities/product-variant.entity";
import { ProductEntity } from "../../product/entities/product.entity";

@Injectable()
export class ProductVariantRepository {
    constructor(
        @InjectRepository(ProductVariantEntity)
        private readonly repository: Repository<ProductVariantEntity>,
    ) { }

    private mapVariantEntity(variant: ProductVariantEntity): ProductVariantEntity {
        const result = new ProductVariantEntity();
        result.id = variant.id;
        result.label = variant.label;
        result.price = typeof variant.price === 'string' ? Number.parseFloat(variant.price) : variant.price;
        result.sortOrder = variant.sortOrder;
        result.maxFlavors = variant.maxFlavors;
        result.isActive = variant.isActive;
        result.createdAt = variant.createdAt;
        result.updatedAt = variant.updatedAt;
        return result;
    }

    async createVariant(productId: string, variant: Partial<ProductVariantEntity>): Promise<ProductVariantEntity> {
        return this.repository.manager.transaction(async manager => {
            const productRepo = manager.getRepository(ProductEntity);
            const product = await productRepo.findOne({ where: { id: productId } });
            if (!product) {
                throw new NotFoundException({ message: 'Produto não encontrado', field: 'productId', detail: `Produto com id ${productId} não foi encontrado` });
            }

            const variantRepo = manager.getRepository(ProductVariantEntity);
            const entity = variantRepo.create({ ...variant, product });
            const saved = await variantRepo.save(entity);
            return this.mapVariantEntity(saved);
        });
    }

    async findAllByProductId(productId: string): Promise<ProductVariantEntity[]> {
        const variants = await this.repository.find({
            where: { product: { id: productId } },
            order: { sortOrder: 'ASC' },
        });
        return variants.map((v) => this.mapVariantEntity(v));
    }

    async findById(id: string): Promise<ProductVariantEntity | null> {
        return this.repository.findOne({ where: { id }, relations: ['product'] });
    }

    async findByIdForProduct(id: string, productId: string): Promise<ProductVariantEntity | null> {
        const variant = await this.repository.findOne({ where: { id, product: { id: productId } } });
        return variant ? this.mapVariantEntity(variant) : null;
    }

    async updateVariant(id: string, variant: Partial<ProductVariantEntity>): Promise<ProductVariantEntity> {
        const entity = await this.repository.preload({ id, ...variant });
        if (!entity) {
            throw new NotFoundException({ message: 'Variação não encontrada', field: 'id', detail: `Variação com id ${id} não encontrada` });
        }
        const updated = await this.repository.save(entity);
        return this.mapVariantEntity(updated);
    }

    async deleteVariant(id: string): Promise<void> {
        const variant = await this.repository.findOne({ where: { id } });
        if (!variant) {
            throw new NotFoundException({ message: 'Variação não encontrada', field: 'id', detail: `Variação com id ${id} não encontrada` });
        }
        await this.repository.remove(variant);
    }
}
