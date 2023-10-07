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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a user',
  })
  registerUser(@Body() body: RegisterUserDto) {
    return this.usersService.registerUser(body);
  }

  @Post('admin')
  @ApiOperation({
    summary: 'Create a user (need the initial token)',
  })
  registerAdmin(@Headers() { authorization }, @Body() body: RegisterAdminDto) {
    if (authorization != process.env.INITIAL_TOKEN) {
      throw new UnauthorizedException();
    }
    return this.usersService.registerUser(body, true);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiOperation({
    summary: 'Get the user info',
  })
  @ApiBearerAuth('access-token')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Get('purchases')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiOperation({
    summary: 'Get the user purchases',
  })
  @ApiBearerAuth('access-token')
  getPurchases(@Request() req) {
    return this.usersService.getPurchases(req.user.userId);
  }
}
