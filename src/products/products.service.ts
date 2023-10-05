import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

  getProduct(id: number) {
    return this.validateProductId(id);
  }

  async deleteProduct(id: number) {
    await this.validateProductId(id);
    return this.productRepository.delete(id);
  }

  async updateProduct(id: number, product: UpdateProductDto) {
    const productFound = await this.validateProductId(id);
    const updatedProduct = Object.assign(productFound, product);
    await this.productRepository.update({ id }, updatedProduct);
    return updatedProduct;
  }

  async validateProductId(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    if (!product) {
      throw new NotFoundException('Product id not found');
    }
    return product;
  }
}
