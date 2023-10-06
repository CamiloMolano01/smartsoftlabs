import {
  Body,
  Controller,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  registerUser(@Body() body: RegisterUserDto) {
    return this.usersService.registerUser(body);
  }

  @Post('admin')
  registerAdmin(@Headers() { authorization }, @Body() body: RegisterAdminDto) {
    if (authorization != process.env.INITIAL_TOKEN) {
      throw new UnauthorizedException();
    }
    return this.usersService.registerUser(body, true);
  }
}
