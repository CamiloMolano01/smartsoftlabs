import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async registerUser(
    user: RegisterUserDto | RegisterAdminDto,
    isAdmin?: boolean,
  ) {
    const userFound = await this.getUser(user.username);
    if (userFound) throw new ConflictException('Username is already in use');
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create(user);
    if (isAdmin) newUser.role = Role.Admin;
    newUser.purchases = [];
    const result = await this.userRepository.save(newUser);
    delete result.password;
    return result;
  }

  async getUser(username: string) {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async getUserWithId(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        purchases: true,
      },
    });
  }

  async getPurchases(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.purchases', 'purchases')
      .leftJoinAndSelect('purchases.products', 'products')
      .select([
        'user.id',

        'purchases.id',
        'purchases.date',
        'purchases.total',

        'products.id',
        'products.name',
        'products.category',
        'products.price',
      ])
      .getOne();

    return user.purchases;
  }

  async saveUser(user: User) {
    return this.userRepository.save(user);
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: { id: true, name: true, username: true, money: true },
    });
    return user;
  }
}
