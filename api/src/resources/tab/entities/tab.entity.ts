import { TabItemEntity } from "../../tab-item/entities/tab-item.entity";
import { BarEntity } from "../../bar/entities/bar.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TabStatus {
    OPEN = 'open',
    CLOSED = 'closed',
}

@Entity({ name: 'tabs', schema: 'public' })
export class TabEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: TabStatus, default: TabStatus.OPEN })
    status: TabStatus;

    @Column({ type: 'integer', nullable: true, name: 'table_number' })
    tableNumber: number;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'customer_name' })
    customerName: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'total_value' })
    totalValue: number;

    @ManyToOne(() => BarEntity, bar => bar.tabs, {
        nullable: true,
    })

    @JoinColumn({ name: 'bar_id' })
    bar: BarEntity;

    @ManyToOne(() => UserEntity, user => user.openTabs, {
        nullable: false,
    })

    @JoinColumn({ name: 'waiter_open_id' })
    waiterOpen: UserEntity;

    @ManyToOne(() => UserEntity, user => user.closedTabs, {
        nullable: true,
    })
    @JoinColumn({ name: 'waiter_closed_id' })
    waiterClosed: UserEntity;

    @OneToMany(() => TabItemEntity, tabItem => tabItem.tab)
    items: TabItemEntity[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
    closedAt?: Date;
}
