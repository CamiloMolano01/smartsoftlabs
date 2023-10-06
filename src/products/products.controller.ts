import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @Roles(Role.Admin)
  createProduct(@Body() body: CreateProductDto) {
    return this.productsService.createProduct(body);
  }

  @Get()
  getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getProduct(id);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, body);
  }
}
