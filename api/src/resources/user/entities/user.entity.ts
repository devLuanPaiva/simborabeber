import { TabEntity } from '../../tab/entities/tab.entity';
import { BarEntity } from '../../bar/entities/bar.entity';
import { TabItemEntity } from '../../tab-item/entities/tab-item.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,

} from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    WAITER = 'waiter',
}

@Entity({ name: 'users', schema: 'public' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 120
    })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.WAITER
    })
    role: UserRole;

    @Column()
    password: string;

    @Column({
        name: 'last_login',
        type: 'timestamptz',
        nullable: true
    })
    lastLogin?: Date;

    @Column({
        type: 'boolean',
        default: true,
        name: 'is_active'
    })
    isActive: boolean;

    @ManyToOne(() => BarEntity, bar => bar.users, {
        nullable: true,
    })

    @JoinColumn({ name: 'bar_id' })
    bar: BarEntity;

    @OneToMany(() => TabEntity, tab => tab.waiterOpen)
    openTabs: TabEntity[];

    @OneToMany(() => TabEntity, tab => tab.waiterClosed)
    closedTabs: TabEntity[];

    @OneToMany(() => TabItemEntity, tabItem => tabItem.waiterAdded)
    addedTabItems: TabItemEntity[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
}

