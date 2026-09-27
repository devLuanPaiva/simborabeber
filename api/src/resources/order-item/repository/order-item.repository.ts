import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderItemEntity } from "../entities/order-item.entity";
import { OrderEntity, OrderStatus } from "../../order/entities/order.entity";

const EDITABLE_STATUSES = [OrderStatus.RECEIVED, OrderStatus.PREPARING];

@Injectable()
export class OrderItemRepository {
    constructor(
        @InjectRepository(OrderItemEntity)
        private readonly repository: Repository<OrderItemEntity>,
    ) { }

    private mapOrderItemEntity(item: OrderItemEntity): OrderItemEntity {
        const result = new OrderItemEntity();
        result.id = item.id;
        result.name = item.name;
        result.price = typeof item.price === 'string' ? Number.parseFloat(item.price) : item.price;
        result.quantity = typeof item.quantity === 'string' ? Number.parseInt(item.quantity) : item.quantity;
        result.notes = item.notes;
        result.category = item.category;
        result.createdAt = item.createdAt;
        result.updatedAt = item.updatedAt;
        return result;
    }

    private assertEditable(order: OrderEntity, action: 'alterados' | 'removidos'): void {
        if (!EDITABLE_STATUSES.includes(order.status)) {
            throw new BadRequestException({
                message: 'Pedido não pode mais ser editado',
                field: 'status',
                detail: `Itens só podem ser ${action} enquanto o pedido está em "${OrderStatus.RECEIVED}" ou "${OrderStatus.PREPARING}" (status atual: "${order.status}")`,
            });
        }
    }

    async findItemsByOrder(orderId: string): Promise<OrderItemEntity[]> {
        const items = await this.repository.find({
            where: { order: { id: orderId } },
            order: { createdAt: 'ASC' },
        });

        return items.map((item) => this.mapOrderItemEntity(item));
    }

    async updateItemQuantity(id: string, quantity: number): Promise<OrderItemEntity> {
        return this.repository.manager.transaction(async (manager) => {
            const itemRepo = manager.getRepository(OrderItemEntity);
            const orderRepo = manager.getRepository(OrderEntity);

            const item = await itemRepo.findOne({ where: { id }, relations: ['order'] });
            if (!item) {
                throw new NotFoundException({ message: 'Item não encontrado', field: 'id', detail: `Item com id ${id} não foi encontrado` });
            }

            this.assertEditable(item.order, 'alterados');

            const oldQuantity = Number(item.quantity);
            item.quantity = quantity;
            const savedItem = await itemRepo.save(item);

            const diff = (Number(quantity) - oldQuantity) * Number(item.price);
            const order = item.order;
            order.totalValue = Number(order.totalValue || 0) + diff;
            await orderRepo.save(order);

            return this.mapOrderItemEntity(savedItem);
        });
    }

    async deleteItem(id: string): Promise<void> {
        return this.repository.manager.transaction(async (manager) => {
            const itemRepo = manager.getRepository(OrderItemEntity);
            const orderRepo = manager.getRepository(OrderEntity);

            const item = await itemRepo.findOne({ where: { id }, relations: ['order'] });
            if (!item) {
                throw new NotFoundException({ message: 'Item não encontrado', field: 'id', detail: `Item com id ${id} não foi encontrado` });
            }

            this.assertEditable(item.order, 'removidos');

            const order = item.order;
            const subtract = Number(item.price) * Number(item.quantity);
            order.totalValue = Math.max(0, Number(order.totalValue || 0) - subtract);
            await orderRepo.save(order);

            await itemRepo.delete(id);
        });
    }

    async findByIdWithOrder(id: string): Promise<OrderItemEntity | null> {
        return this.repository.findOne({ where: { id }, relations: ['order'] });
    }
}
