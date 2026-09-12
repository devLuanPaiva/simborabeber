import { OrderItemEntity } from "../../order-item/entities/order-item.entity";
import { BarEntity } from "../../bar/entities/bar.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum OrderType {
    DELIVERY = 'delivery',
    PICKUP = 'pickup',
}

export enum OrderStatus {
    RECEIVED = 'received',
    PREPARING = 'preparing',
    READY = 'ready',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    PIX = 'pix',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
}

@Entity({ name: 'orders', schema: 'public' })
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: OrderType })
    type: OrderType;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.RECEIVED })
    status: OrderStatus;

    @Column({ type: 'varchar', length: 120, name: 'customer_name' })
    customerName: string;

    @Column({ type: 'varchar', length: 20, name: 'customer_phone' })
    customerPhone: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'delivery_address' })
    deliveryAddress?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'delivery_fee' })
    deliveryFee: number;

    @Column({ type: 'enum', enum: PaymentMethod, name: 'payment_method' })
    paymentMethod: PaymentMethod;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING, name: 'payment_status' })
    paymentStatus: PaymentStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    notes?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'total_value' })
    totalValue: number;

    @ManyToOne(() => BarEntity, bar => bar.orders, {
        nullable: false,
        onDelete: 'CASCADE',
    })

    @JoinColumn({ name: 'bar_id' })
    bar: BarEntity;

    @ManyToOne(() => UserEntity, user => user.attendedOrders, {
        nullable: true,
    })

    @JoinColumn({ name: 'attended_by_id' })
    attendedBy?: UserEntity;

    @OneToMany(() => OrderItemEntity, orderItem => orderItem.order, { cascade: true })
    items: OrderItemEntity[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'ready_at', type: 'timestamp', nullable: true })
    readyAt?: Date;

    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt?: Date;

    @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
    cancelledAt?: Date;
}
