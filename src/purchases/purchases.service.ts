import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Purchase } from './purchase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async createPurchase(purchase: CreatePurchaseDto, userId: number) {
    const user = await this.usersService.getUserWithId(userId);
    const productPromises = purchase.productIds.map((id) =>
      this.productsService.validateProductId(id),
    );

    try {
      const products = await Promise.all(productPromises);
      const total = products.reduce((sum, product) => sum + product.price, 0);
      if (user.money >= total) {
        const newPurchase = this.purchaseRepository.create();
        newPurchase.products = products;
        newPurchase.total = total;
        newPurchase.user = user;
        return this.purchaseRepository.save(newPurchase);
      } else {
        throw new BadRequestException('Insufficient funds');
      }
    } catch (error) {
      throw new BadRequestException('Error to get products', error.message);
    }
  }

  getPurchases() {
    return this.purchaseRepository.find({
      select: {
        user: { id: true, name: true },
        products: { id: true, name: true, price: true },
      },
      relations: {
        user: true,
        products: true,
      },
    });
  }

  async getPurchase(id: number): Promise<Purchase> {
    return this.validatePurchaseId(id);
  }

  async validatePurchaseId(id: number): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findOne({
      where: {
        id,
      },
    });
    if (!purchase) {
      throw new NotFoundException('Purchase id not found');
    }
    return purchase;
  }
}
