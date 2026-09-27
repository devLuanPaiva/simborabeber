import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BarEntity } from "../../bar/entities/bar.entity";
import { ProductCategory } from "../../product/entities/product-category.enum";

@Entity({ name: 'product_addons', schema: 'public' })
export class ProductAddonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 120 })
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'enum', enum: ProductCategory, nullable: true })
    category: ProductCategory | null;

    @Column({ type: 'boolean', default: true, name: 'is_active' })
    isActive: boolean;

    @ManyToOne(() => BarEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bar_id' })
    bar: BarEntity;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
