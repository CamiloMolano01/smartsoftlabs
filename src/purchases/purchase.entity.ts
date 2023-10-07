import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column()
  total: number;

  @ManyToOne(() => User, (user) => user.purchases)
  user: User;

  @ManyToMany(() => Product, (product) => product.purchases)
  @JoinTable()
  products: Product[];
}
