import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async registerUser(user: RegisterUserDto) {
    const userFound = await this.getUser(user.username);
    if (userFound) throw new ConflictException('Username is already in use');
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create(user);
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
}
