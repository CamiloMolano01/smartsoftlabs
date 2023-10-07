import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Purchase } from './purchase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseProductDto } from './dto/purchase-product.dto';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async createPurchase(purchaseProducts: PurchaseProductDto[], userId: number) {
    const user = await this.usersService.getUserWithId(userId);
    const productPromises = purchaseProducts.map((product) =>
      this.productsService.validateProductId(product.id),
    );
    const products = await Promise.all(productPromises);
    return this.validatePurchase(user, products, purchaseProducts);
  }

  async validateQuantity(
    products: Product[],
    purchaseProducts: PurchaseProductDto[],
  ) {
    let total = 0;
    // Primero verifico que todos los productos tengan stock
    purchaseProducts.forEach((purchaseProduct) => {
      const productFound = products.find(
        (product) => product.id === purchaseProduct.id,
      );
      // Sumo al total la cantidad de productos multiplicado por el precio
      total += productFound.price * purchaseProduct.quantity;
      if (productFound.quantity < purchaseProduct.quantity) {
        throw new BadRequestException(
          `Product: ${productFound.name} stock is insufficient`,
        );
      }
    });
    return total;
  }

  async removeBuyedQuantity(
    products: Product[],
    purchaseProducts: PurchaseProductDto[],
  ) {
    // Cuando ya esta confirmado proceso a quitar y guardar la cantidad comprada
    for (const purchaseProduct of purchaseProducts) {
      const productFound = products.find(
        (product) => product.id === purchaseProduct.id,
      );
      // De lo contratio elimino la cantidad comprada
      productFound.quantity -= purchaseProduct.quantity;
      // Guardo la nueva cantidad del producto en la BD
      await this.productsService.saveProduct(productFound);
    }
  }

  async validatePurchase(
    user: User,
    products: Product[],
    purchaseProducts: PurchaseProductDto[],
  ) {
    try {
      // Hago el calculo del total de los productos y valido su stock
      const total = await this.validateQuantity(products, purchaseProducts);
      // Si el usuario no tiene suficiente entonces lanzo una excepción
      if (user.money < total) {
        throw new BadRequestException('Insufficient funds');
      }
      // En caso contrario proceso a quitar del stock de los productos la cantidad comprada
      await this.removeBuyedQuantity(products, purchaseProducts);
      // Creo la nueva compra y le doy sus propiedades
      const newPurchase = this.purchaseRepository.create();
      newPurchase.products = products;
      newPurchase.total = total;
      // Agrego a la lista de compras del usuario
      user.purchases.push(newPurchase);
      // Resto el dinero del usuario de acuerdo a la compra
      user.money -= total;
      // Guardo la compra en la BD
      const purchase = await this.purchaseRepository.save(newPurchase);
      // Guardo el usuario en la BD
      await this.usersService.saveUser(user);
      // retorno la compra sin la cantidad propia del producto
      return this.getPurchaseWithoutQuantity(purchase.id);
    } catch (error) {
      // En caso de que el producto no exista lanzo una excepción
      throw new BadRequestException('Error to get products', error.message);
    }
  }

  getPurchaseWithoutQuantity(id: number) {
    return this.purchaseRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        products: {
          id: true,
          name: true,
          category: true,
          price: true,
        },
        date: true,
        total: true,
      },
      relations: {
        products: true,
      },
    });
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

  async getPurchase(id: number) {
    return this.validatePurchaseId(id);
  }

  async validatePurchaseId(id: number) {
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
