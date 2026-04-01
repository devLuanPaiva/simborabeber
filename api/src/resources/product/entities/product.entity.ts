import { BarEntity } from "../../bar/entities/bar.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ProductCategory {
    BEERS = 'beers',
    DRINKS = 'drinks',
    SNACKS = 'snacks',
    NON_ALCOHOLIC = 'non_alcoholic',
    OTHER = 'other',
    SKEWER = 'skewer',
}

@Entity({ name: 'products', schema: 'public' })
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 120
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    description: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    image: string;

    @Column({
        type: 'boolean',
        default: true,
        name: 'is_active'
    })
    isActive: boolean;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({
        type: 'enum',
        enum: ProductCategory,
    })
    category: ProductCategory;

    @ManyToOne(() => BarEntity, bar => bar.products, {
        nullable: true,
        onDelete: 'CASCADE',
    })

    @JoinColumn({ name: 'bar_id' })
    bar: BarEntity;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
}
