import { BarEntity } from "../../bar/entities/bar.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductCategory } from "./product-category.enum";
import { ProductVariantEntity } from "../../product-variant/entities/product-variant.entity";

export { ProductCategory };

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

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    price?: number;

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

    @OneToMany(() => ProductVariantEntity, variant => variant.product, { cascade: true })
    variants: ProductVariantEntity[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
