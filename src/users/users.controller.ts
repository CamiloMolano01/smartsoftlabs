import {
  Body,
  Controller,
  Post,
  Headers,
  UnauthorizedException,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Get('purchases')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  getPurchases(@Request() req) {
    return this.usersService.getPurchases(req.user.userId);
  }
}
