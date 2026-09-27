import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ProductAddonEntity } from "../entities/product-addon.entity";

@Injectable()
export class ProductAddonRepository {
    constructor(
        @InjectRepository(ProductAddonEntity)
        private readonly repository: Repository<ProductAddonEntity>,
    ) { }

    private mapAddonEntity(addon: ProductAddonEntity): ProductAddonEntity {
        const result = new ProductAddonEntity();
        result.id = addon.id;
        result.name = addon.name;
        result.price = typeof addon.price === 'string' ? Number.parseFloat(addon.price) : addon.price;
        result.category = addon.category;
        result.isActive = addon.isActive;
        result.createdAt = addon.createdAt;
        result.updatedAt = addon.updatedAt;
        return result;
    }

    async createAddon(addon: Partial<ProductAddonEntity>): Promise<ProductAddonEntity> {
        const entity = this.repository.create(addon)
        const saved = await this.repository.save(entity)
        return this.mapAddonEntity(saved)
    }

    async findAllByBarSlug(slug: string, category?: string): Promise<ProductAddonEntity[]> {
        const queryBuilder = this.repository.createQueryBuilder('addon')
            .innerJoin('addon.bar', 'bar', 'bar.slug = :slug', { slug })
            .select([
                'addon.id as id',
                'addon.name as name',
                'addon.price as price',
                'addon.category as category',
                'addon.is_active as "isActive"',
                'addon.created_at as "createdAt"',
                'addon.updated_at as "updatedAt"',
            ])

        if (category) {
            queryBuilder.andWhere('(addon.category = :category OR addon.category IS NULL)', { category })
        }

        const rows: ProductAddonEntity[] = await queryBuilder
            .orderBy('LOWER(unaccent(addon.name))', 'ASC')
            .getRawMany();

        return rows.map((r) => this.mapAddonEntity(r))
    }

    async findById(id: string): Promise<ProductAddonEntity | null> {
        return this.repository.findOne({ where: { id } })
    }

    async findByIdForBar(id: string, barId: string): Promise<ProductAddonEntity | null> {
        const addon = await this.repository.findOne({ where: { id, bar: { id: barId } } })
        return addon ? this.mapAddonEntity(addon) : null
    }

    async findAllByIdsForBar(ids: string[], barId: string): Promise<ProductAddonEntity[]> {
        if (!ids.length) return [];
        const addons = await this.repository.find({ where: { id: In(ids), bar: { id: barId } } })
        return addons.map((a) => this.mapAddonEntity(a))
    }

    async updateAddon(id: string, addon: Partial<ProductAddonEntity>): Promise<ProductAddonEntity> {
        const entity = await this.repository.preload({ id, ...addon })
        if (!entity) {
            throw new NotFoundException({ message: 'Adicional não encontrado', field: 'id', detail: `Adicional com id ${id} não encontrado` })
        }
        const updated = await this.repository.save(entity)
        return this.mapAddonEntity(updated)
    }

    async deleteAddon(id: string): Promise<void> {
        const addon = await this.findById(id);
        if (!addon) {
            throw new NotFoundException({ message: 'Adicional não encontrado', field: 'id', detail: `Adicional com id ${id} não encontrado` })
        }
        await this.repository.remove(addon)
    }

    async toggleAddonStatus(id: string): Promise<ProductAddonEntity> {
        const addon = await this.findById(id);
        if (!addon) {
            throw new NotFoundException({ message: 'Adicional não encontrado', field: 'id', detail: `Adicional com id ${id} não encontrado` })
        }
        addon.isActive = !addon.isActive;
        const updated = await this.repository.save(addon)
        return this.mapAddonEntity(updated)
    }
}
