import { Purchase } from 'src/purchases/purchase.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('numeric', { precision: 10, scale: 2 })
  money: number;

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];
}
