import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderEntity, OrderStatus } from "../entities/order.entity";

@Injectable()
export class OrderRepository {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly repository: Repository<OrderEntity>,
    ) { }

    async createOrder(order: Partial<OrderEntity>): Promise<OrderEntity> {
        const entity = this.repository.create(order);
        const saved = await this.repository.save(entity);

        const created = await this.findById(saved.id);
        if (!created) {
            throw new NotFoundException({ message: 'Pedido não encontrado', field: 'id', detail: `Pedido com id ${saved.id} não foi encontrado` });
        }

        return created;
    }

    async findThemAllByBarSlug(barSlug: string, status?: OrderStatus): Promise<OrderEntity[]> {
        const query = this.repository.createQueryBuilder('order')
            .innerJoin('order.bar', 'bar', 'bar.slug = :slug', { slug: barSlug })
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.components', 'itemComponents')
            .leftJoinAndSelect('items.addons', 'itemAddons')
            .leftJoin('order.attendedBy', 'attendedBy')
            .addSelect(['attendedBy.id', 'attendedBy.name'])
            .orderBy('order.createdAt', 'DESC');

        if (status) {
            query.andWhere('order.status = :status', { status });
        }

        return query.getMany();
    }

    async findById(id: string): Promise<OrderEntity | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['items', 'items.components', 'items.addons', 'attendedBy', 'bar'],
        });
    }

    async findByIdWithBar(id: string): Promise<OrderEntity | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['bar'],
        });
    }

    async updateOrder(order: Partial<OrderEntity>): Promise<OrderEntity> {
        await this.repository.save(order);

        const updated = await this.findById(order.id as string);
        if (!updated) {
            throw new NotFoundException({ message: 'Pedido não encontrado', field: 'id', detail: `Pedido com id ${order.id} não foi encontrado` });
        }

        return updated;
    }

    async deleteOrder(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
