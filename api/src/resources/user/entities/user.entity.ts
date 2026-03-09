import { BarEntity } from '../../bar/entities/bar.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,

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
        type: 'timestamp',
        nullable: true
    })
    lastLogin?: Date;

    @ManyToOne(() => BarEntity, bar => bar.users, {
        nullable: true,
    })

    @JoinColumn({ name: 'bar_id' })
    bar: BarEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

