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

    async createProduct(product: Partial<ProductEntity>): Promise<ProductEntity> {
        const entity = this.repository.create(product)
        return this.repository.save(entity)
    }

    async createProducts(products: Partial<ProductEntity>[]): Promise<ProductEntity[]> {
        const entities = this.repository.create(products)
        return this.repository.save(entities)
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
                'product.category as category',
                'product.created_at as "createdAt"',
                'product.updated_at as "updatedAt"',
            ])
            .where('product.is_active = :isActive', { isActive: true })

        if (category) {
            queryBuilder.andWhere('product.category = :category', { category })
        }

        const rows = await queryBuilder
            .orderBy('product.created_at', 'DESC')
            .getRawMany();

        return rows.map((r) => {
            const p = new ProductEntity();
            p.id = r.id;
            p.name = r.name;
            p.description = r.description;
            p.image = r.image;
            p.price = typeof r.price === 'string' ? Number.parseFloat(r.price) : r.price;
            p.category = r.category;
            p.createdAt = r.createdAt ? new Date(r.createdAt) : undefined;
            p.updatedAt = r.updatedAt ? new Date(r.updatedAt) : undefined;
            return p;
        })
    }

    async findById(id: string): Promise<ProductEntity | null> {
        return this.repository.findOne({
            where: { id },
        })
    }

    async updateProduct(id: string, product: Partial<ProductEntity>): Promise<ProductEntity> {
        const entity = await this.repository.preload({ id, ...product })
        if (!entity) {
            throw new NotFoundException({ message: 'Produto não encontrado', field: 'id', detail: `Produto com id ${id} não encontrado` })
        }
        return this.repository.save(entity)
    }

    async deleteProduct(id: string): Promise<void> {
        const product = await this.findById(id);
        if (!product) {
            throw new NotFoundException({ message: 'Produto não encontrado', field: 'id', detail: `Produto com id ${id} não encontrado` })
        }
        await this.repository.remove(product)
    }
}