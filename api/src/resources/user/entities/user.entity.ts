import { Establishment } from '../../../resources/establishment/entities/establishment.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  WAITER = 'WAITER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.WAITER,
  })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => Establishment, (establishment) => establishment.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  establishment?: Establishment;
}
