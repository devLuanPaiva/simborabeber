import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TabItemEntity } from "./tab-item.entity";
import { ProductAddonEntity } from "../../product-addon/entities/product-addon.entity";

@Entity({ name: 'tab_item_addons', schema: 'public' })
export class TabItemAddonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 120 })
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => TabItemEntity, tabItem => tabItem.addons, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tab_item_id' })
    tabItem: TabItemEntity;

    @ManyToOne(() => ProductAddonEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'addon_id' })
    addon: ProductAddonEntity | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
