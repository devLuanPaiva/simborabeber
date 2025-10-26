import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum EstablishmentType {
  SNACK_BARS = 'SNACK_BARS',
  RESTAURANTS = 'RESTAURANTS',
  STEAKHOUSES = 'STEAKHOUSES',
  BARS = 'BARS',
  ICE_CREAM_PARLORS = 'ICE_CREAM_PARLORS',
  PIZZARIAS = 'PIZZARIAS',
}

@Entity('establishments')
export class Establishment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: EstablishmentType,
  })
  type: EstablishmentType;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.establishment)
  users: User[];
}
