import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  createProduct(product: CreateProductDto) {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  getProducts() {
    return this.productRepository.find();
  }
}
