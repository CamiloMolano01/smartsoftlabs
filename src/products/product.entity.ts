import { Purchase } from 'src/purchases/purchase.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  price: number;

  @Column('integer')
  quantity: number;

  @ManyToMany(() => Purchase, (purchase) => purchase.products)
  purchases: Purchase;
}
