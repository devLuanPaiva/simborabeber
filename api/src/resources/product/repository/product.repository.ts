import { Injectable } from "@nestjs/common";
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

    async findAllByBarSlug(slug: string): Promise<ProductEntity[]> {
        const rows = await this.repository.createQueryBuilder('product')
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
            throw new Error(`Produto com id ${id} não encontrado`)
        }
        return this.repository.save(entity)
    }

    async deleteProduct(id: string): Promise<void> {
        const product = await this.findById(id);
        if (!product) {
            throw new Error(`Produto com id ${id} não encontrado`)
        }
        await this.repository.remove(product)
    }
}