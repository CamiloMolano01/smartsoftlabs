import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PurchasesModule } from './purchases/purchases.module';

@Module({
  imports: [UsersModule, ProductsModule, PurchasesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
