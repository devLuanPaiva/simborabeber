import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItemEntity } from "./order-item.entity";
import { ProductEntity } from "../../product/entities/product.entity";

@Entity({ name: 'order_item_components', schema: 'public' })
export class OrderItemComponentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 120, name: 'product_name' })
    productName: string;

    @Column({ type: 'varchar', length: 20, nullable: true, name: 'variant_label' })
    variantLabel: string | null;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => OrderItemEntity, orderItem => orderItem.components, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_item_id' })
    orderItem: OrderItemEntity;

    @ManyToOne(() => ProductEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
