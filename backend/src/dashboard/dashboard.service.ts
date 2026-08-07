import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  User,
  SellerProfile,
  BuyerProfile,
  Product,
  Order,
  Payment,
} from '../database/entities';
import { UserRole, ApprovalStatus, ProductStatus, PaymentStatus } from '../common/enums';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(SellerProfile) private sellerRepo: Repository<SellerProfile>,
    @InjectRepository(BuyerProfile) private buyerRepo: Repository<BuyerProfile>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
  ) {}

  async getStats() {
    const [
      totalUsers,
      totalSellers,
      totalBuyers,
      totalProducts,
      pendingProducts,
      pendingSellers,
      totalOrders,
      revenueResult,
      recentOrders,
    ] = await Promise.all([
      this.userRepo.count(),
      this.userRepo.count({ where: { role: UserRole.SELLER } }),
      this.userRepo.count({ where: { role: UserRole.BUYER } }),
      this.productRepo.count(),
      this.productRepo.count({ where: { status: ProductStatus.PENDING } }),
      this.sellerRepo.count({ where: { status: ApprovalStatus.PENDING } }),
      this.orderRepo.count(),
      this.paymentRepo
        .createQueryBuilder('payment')
        .select('COALESCE(SUM(payment.amount), 0)', 'total')
        .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
        .getRawOne(),
      this.orderRepo.find({
        take: 10,
        order: { createdAt: 'DESC' },
        relations: ['buyer', 'buyer.user'],
      }),
    ]);

    return {
      totalUsers,
      totalSellers,
      totalBuyers,
      totalProducts,
      pendingProducts,
      pendingSellers,
      totalOrders,
      revenue: Number(revenueResult?.total || 0),
      recentOrders,
    };
  }
}
