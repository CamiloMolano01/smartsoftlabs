import { Role } from 'src/auth/enums/role.enum';
import { Purchase } from 'src/purchases/purchase.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ length: 100 })
  name: string;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  money: number;

  @Column({ default: Role.User })
  role: Role;

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];
}
