import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import {
  UserRole,
  ApprovalStatus,
  ProductStatus,
  PaymentStatus,
  OrderStatus,
  isStaffRole,
} from '../common/enums';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(SellerProfile) private sellerRepo: Repository<SellerProfile>,
    @InjectRepository(BuyerProfile) private buyerRepo: Repository<BuyerProfile>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(Wishlist) private wishlistRepo: Repository<Wishlist>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async getStatsForUser(userId: string, role: string) {
    if (isStaffRole(role)) {
      return this.getAdminStats();
    }
    if (role === UserRole.SELLER) {
      return this.getSellerStats(userId);
    }
    if (role === UserRole.BUYER) {
      return this.getBuyerStats(userId);
    }
    throw new ForbiddenException('Dashboard not available for this role');
  }

  async getAdminStats() {
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

  async getSellerStats(userId: string) {
    const seller = await this.sellerRepo.findOne({ where: { userId } });
    if (!seller) {
      throw new ForbiddenException('Seller profile required');
    }

    const sellerId = seller.id;

    const [totalProducts, salesResult, pendingOrdersResult, customersResult] =
      await Promise.all([
        this.productRepo.count({ where: { sellerId } }),
        this.orderItemRepo
          .createQueryBuilder('item')
          .innerJoin('item.order', 'ord')
          .select('COALESCE(SUM(item.totalPrice), 0)', 'total')
          .where('item.sellerId = :sellerId', { sellerId })
          .andWhere('ord.status != :cancelled', {
            cancelled: OrderStatus.CANCELLED,
          })
          .getRawOne(),
        this.orderItemRepo
          .createQueryBuilder('item')
          .innerJoin('item.order', 'ord')
          .select('COUNT(DISTINCT ord.id)', 'count')
          .where('item.sellerId = :sellerId', { sellerId })
          .andWhere('ord.status = :pending', { pending: OrderStatus.PENDING })
          .getRawOne(),
        this.orderItemRepo
          .createQueryBuilder('item')
          .innerJoin('item.order', 'ord')
          .select('COUNT(DISTINCT ord.buyerId)', 'count')
          .where('item.sellerId = :sellerId', { sellerId })
          .andWhere('ord.status != :cancelled', {
            cancelled: OrderStatus.CANCELLED,
          })
          .getRawOne(),
      ]);

    return {
      totalProducts,
      totalSales: Number(salesResult?.total || 0),
      pendingOrders: Number(pendingOrdersResult?.count || 0),
      totalCustomers: Number(customersResult?.count || 0),
    };
  }

  async getBuyerStats(userId: string) {
    const buyer = await this.buyerRepo.findOne({ where: { userId } });
    if (!buyer) {
      throw new ForbiddenException('Buyer profile required');
    }

    const buyerId = buyer.id;

    const [
      totalOrders,
      cartCount,
      wishlistCount,
      unreadNotifications,
      recentOrders,
    ] = await Promise.all([
      this.orderRepo.count({ where: { buyerId } }),
      this.cartRepo.count({ where: { buyerId } }),
      this.wishlistRepo.count({ where: { buyerId } }),
      this.notificationRepo.count({ where: { userId, isRead: false } }),
      this.orderRepo.find({
        where: { buyerId },
        take: 5,
        order: { createdAt: 'DESC' },
        relations: ['items'],
      }),
    ]);

    return {
      totalOrders,
      cartCount,
      wishlistCount,
      unreadNotifications,
      recentOrders,
    };
  }
}
