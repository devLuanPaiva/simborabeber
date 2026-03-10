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

    async findAll(): Promise<ProductEntity[]> {
        return this.repository.find()
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