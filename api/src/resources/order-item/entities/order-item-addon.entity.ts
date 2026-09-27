import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItemEntity } from "./order-item.entity";
import { ProductAddonEntity } from "../../product-addon/entities/product-addon.entity";

@Entity({ name: 'order_item_addons', schema: 'public' })
export class OrderItemAddonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 120 })
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => OrderItemEntity, orderItem => orderItem.addons, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_item_id' })
    orderItem: OrderItemEntity;

    @ManyToOne(() => ProductAddonEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'addon_id' })
    addon: ProductAddonEntity | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
