import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum Category {
  COLD_DRINKS = 'COLD_DRINKS',
  HOT_DRINKS = 'HOT_DRINKS',
  DESSERTS = 'DESSERTS',
  SNACKS = 'SNACKS',
  COMBOS = 'COMBOS',

  ACAI = 'ACAI',
  SANDWICHES = 'SANDWICHES',
  BURGERS = 'BURGERS',

  MEALS = 'MEALS',
  PASTA = 'PASTA',
  SIDE_DISHES = 'SIDE_DISHES',

  MEATS = 'MEATS',
  SKEWERS = 'SKEWERS',
  BARBECUE = 'BARBECUE',

  ALCOHOLIC_DRINKS = 'ALCOHOLIC_DRINKS',
  COCKTAILS = 'COCKTAILS',
  CRAFT_BEERS = 'CRAFT_BEERS',

  ICE_CREAM = 'ICE_CREAM',
  TOPPINGS = 'TOPPINGS',

  SAVORY_PIZZAS = 'SAVORY_PIZZAS',
  SWEET_PIZZAS = 'SWEET_PIZZAS',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'double precision' })
  salePrice: number;

  @Column({ type: 'double precision', nullable: true })
  purchasePrice?: number | null;

  @Column({ type: 'enum', enum: Category })
  category: Category;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: true })
  barCode?: string | null;

  @Column({ type: 'boolean', default: true })
  showInMenu: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
