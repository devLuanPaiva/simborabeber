import { TabEntity } from "../../tab/entities/tab.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { OrderEntity } from "../../order/entities/order.entity";
import { DeliveryCityEntity } from "./delivery-city.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

export enum AccessPlan {
    BASIC = 'basic',
    MEDIUM = 'medium',
    PREMIUM = 'premium',
}

@Entity({ name: 'bars', schema: 'public' })
export class BarEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 120
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 120,
        unique: true
    })
    slug: string;

    @ManyToOne(() => UserEntity, user => user.ownedBars, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'owner_id' })
    owner: UserEntity;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    image: string;

    @Column({
        type: 'enum',
        enum: AccessPlan,
        default: AccessPlan.BASIC,
        name: 'access_plan'
    })
    accessPlan: AccessPlan;

    @Column({
        type: 'boolean',
        default: true,
        name: 'is_active'
    })
    isActive: boolean;

    @Column({
        type: 'boolean',
        default: true,
        name: 'comandas_enabled'
    })
    comandasEnabled: boolean;

    @Column({
        type: 'boolean',
        default: false,
        name: 'delivery_enabled'
    })
    deliveryEnabled: boolean;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
        name: 'delivery_fee'
    })
    deliveryFee: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
        name: 'min_order_value'
    })
    minOrderValue: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'delivery_origin_address'
    })
    deliveryOriginAddress?: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'opening_hours'
    })
    openingHours?: string;

    @OneToMany(() => DeliveryCityEntity, city => city.bar, { cascade: true, eager: true, orphanedRowAction: 'delete' })
    deliveryCities: DeliveryCityEntity[];

    @OneToMany(() => UserEntity, user => user.bar, { cascade: true })
    users: UserEntity[];

    @OneToMany(() => ProductEntity, product => product.bar, { cascade: true })
    products: ProductEntity[];

    @OneToMany(() => TabEntity, tab => tab.bar, { cascade: true })
    tabs: TabEntity[];

    @OneToMany(() => OrderEntity, order => order.bar, { cascade: true })
    orders: OrderEntity[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
