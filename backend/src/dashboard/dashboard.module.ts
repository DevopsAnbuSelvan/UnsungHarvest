import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  SellerProfile,
  BuyerProfile,
  Product,
  Order,
  OrderItem,
  Payment,
  Cart,
  Wishlist,
  Notification,
} from '../database/entities';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      SellerProfile,
      BuyerProfile,
      Product,
      Order,
      OrderItem,
      Payment,
      Cart,
      Wishlist,
      Notification,
    ]),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
