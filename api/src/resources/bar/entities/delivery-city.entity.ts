import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BarEntity } from "./bar.entity";

@Entity({ name: 'delivery_cities', schema: 'public' })
export class DeliveryCityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 120 })
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    fee: number;

    @ManyToOne(() => BarEntity, bar => bar.deliveryCities, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bar_id' })
    bar: BarEntity;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
