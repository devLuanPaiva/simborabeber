import { UserEntity } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @OneToMany(() => UserEntity, user => user.bar)
    users: UserEntity[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
