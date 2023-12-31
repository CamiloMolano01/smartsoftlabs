import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  Param,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PurchaseListDto } from './dto/purchase-product.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('purchases')
@UseGuards(JwtAuthGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  @ApiOperation({
    summary: 'Create a purchase (User)',
  })
  @ApiBearerAuth('access-token')
  createPurchase(@Request() req, @Body() body: PurchaseListDto) {
    return this.purchasesService.createPurchase(body.products, req.user.userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get purchases (Admin)',
  })
  @ApiBearerAuth('access-token')
  getPurchases() {
    return this.purchasesService.getPurchases();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get a purchase (Admin)',
  })
  @ApiBearerAuth('access-token')
  getPurchase(@Param('id', ParseIntPipe) id: number) {
    return this.purchasesService.getPurchase(id);
  }
}
