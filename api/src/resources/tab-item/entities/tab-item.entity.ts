import { TabEntity } from "../../tab/entities/tab.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'tab_items', schema: 'public' })
export class TabItemEntity {
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

    @ManyToOne(() => TabEntity, tab => tab.items, {
        nullable: false,
        onDelete: 'CASCADE',
    })

    @JoinColumn({ name: 'tab_id' })
    tab: TabEntity

    @ManyToOne(() => UserEntity, user => user.addedTabItems, {
        nullable: false,
    })

    @JoinColumn({ name: 'waiter_added_id' })
    waiterAdded: UserEntity;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
