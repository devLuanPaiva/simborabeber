import { ProductCategory } from "../../product/entities/product-category.enum";
import { OrderEntity } from "../../order/entities/order.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'order_items', schema: 'public' })
export class OrderItemEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 120
    })
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'integer' })
    quantity: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    notes?: string;

    @Column({
        type: 'enum',
        default: ProductCategory.OTHER,
        enum: ProductCategory,
    })
    category: ProductCategory;

    @ManyToOne(() => OrderEntity, order => order.items, {
        nullable: false,
        onDelete: 'CASCADE',
    })

    @JoinColumn({ name: 'order_id' })
    order: OrderEntity

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
