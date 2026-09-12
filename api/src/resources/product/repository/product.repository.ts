import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../entities/product.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProductRepository {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly repository: Repository<ProductEntity>
    ) { }

    private mapProductEntity(product: ProductEntity): ProductEntity {
        const result = new ProductEntity();
        result.id = product.id;
        result.name = product.name;
        result.description = product.description;
        result.image = product.image;
        result.price = typeof product.price === 'string' ? Number.parseFloat(product.price) : product.price;
        result.category = product.category;
        result.isActive = product.isActive;
        result.createdAt = product.createdAt;
        result.updatedAt = product.updatedAt;
        return result;
    }

    async createProduct(product: Partial<ProductEntity>): Promise<ProductEntity> {
        const entity = this.repository.create(product)
        const saved = await this.repository.save(entity)
        return this.mapProductEntity(saved)
    }

    async createProducts(products: Partial<ProductEntity>[]): Promise<ProductEntity[]> {
        const entities = this.repository.create(products)
        const saved = await this.repository.save(entities)
        return saved.map((s) => this.mapProductEntity(s))
    }

    async findAllByBarSlug(slug: string, category?: string): Promise<ProductEntity[]> {
        const queryBuilder = this.repository.createQueryBuilder('product')
            .innerJoin('product.bar', 'bar', 'bar.slug = :slug', { slug })
            .select([
                'product.id as id',
                'product.name as name',
                'product.description as description',
                'product.image as image',
                'product.price as price',
                'product.is_active as "isActive"',
                'product.category as category',
                'product.created_at as "createdAt"',
                'product.updated_at as "updatedAt"',
            ])

        if (category) {
            queryBuilder.andWhere('product.category = :category', { category })
        }

        const rows: ProductEntity[] = await queryBuilder
            .orderBy("LOWER(unaccent(product.name))", 'ASC')
            .addOrderBy('product.created_at', 'DESC')
            .getRawMany();

        return rows.map((r) => this.mapProductEntity(r))
    }

    async findById(id: string): Promise<ProductEntity | null> {
        return this.repository.findOne({
            where: { id },
        })
    }

    async findByIdForBar(id: string, barId: string): Promise<ProductEntity | null> {
        const product = await this.repository.findOne({
            where: { id, bar: { id: barId } },
        })
        return product ? this.mapProductEntity(product) : null
    }

    async updateProduct(id: string, product: Partial<ProductEntity>): Promise<ProductEntity> {
        const entity = await this.repository.preload({ id, ...product })
        if (!entity) {
            throw new NotFoundException({ message: 'Produto não encontrado', field: 'id', detail: `Produto com id ${id} não encontrado` })
        }
        const updated = await this.repository.save(entity)
        return this.mapProductEntity(updated)
    }

    async deleteProduct(id: string): Promise<void> {
        const product = await this.findById(id);
        if (!product) {
            throw new NotFoundException({ message: 'Produto não encontrado', field: 'id', detail: `Produto com id ${id} não encontrado` })
        }
        await this.repository.remove(product)
    }

    async toggleProductStatus(id: string): Promise<ProductEntity> {
        const product = await this.findById(id);
        if (!product) {
            throw new NotFoundException({ message: 'Produto não encontrado', field: 'id', detail: `Produto com id ${id} não encontrado` })
        }
        product.isActive = !product.isActive;
        const updated = await this.repository.save(product)
        return this.mapProductEntity(updated)
    }
}