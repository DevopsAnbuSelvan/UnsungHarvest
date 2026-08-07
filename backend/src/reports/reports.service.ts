import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, Product, User, Payment } from '../database/entities';
import { PaymentStatus } from '../common/enums';
import { SalesReportDto, AnalyticsDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
  ) {}

  async salesReport(dto: SalesReportDto) {
    const qb = this.orderRepo.createQueryBuilder('order')
      .select('DATE(order.createdAt)', 'date')
      .addSelect('COUNT(order.id)', 'orderCount')
      .addSelect('SUM(order.total)', 'revenue')
      .groupBy('DATE(order.createdAt)')
      .orderBy('date', 'ASC');

    if (dto.startDate) {
      qb.andWhere('order.createdAt >= :startDate', { startDate: dto.startDate });
    }
    if (dto.endDate) {
      qb.andWhere('order.createdAt <= :endDate', { endDate: dto.endDate });
    }

    return qb.getRawMany();
  }

  async topProducts() {
    return this.orderRepo
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .select('item.productName', 'productName')
      .addSelect('SUM(item.quantity)', 'totalSold')
      .addSelect('SUM(item.totalPrice)', 'revenue')
      .groupBy('item.productName')
      .orderBy('"totalSold"', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async analytics(dto: AnalyticsDto) {
    const orderQb = this.orderRepo.createQueryBuilder('order');
    const paymentQb = this.paymentRepo.createQueryBuilder('payment');

    if (dto.startDate) {
      orderQb.andWhere('order.createdAt >= :startDate', { startDate: dto.startDate });
      paymentQb.andWhere('payment.createdAt >= :startDate', { startDate: dto.startDate });
    }
    if (dto.endDate) {
      orderQb.andWhere('order.createdAt <= :endDate', { endDate: dto.endDate });
      paymentQb.andWhere('payment.createdAt <= :endDate', { endDate: dto.endDate });
    }

    const [orderStats, paymentStats, userCount, productCount] = await Promise.all([
      orderQb
        .select('order.status', 'status')
        .addSelect('COUNT(order.id)', 'count')
        .groupBy('order.status')
        .getRawMany(),
      paymentQb
        .select('payment.status', 'status')
        .addSelect('COUNT(payment.id)', 'count')
        .addSelect('SUM(payment.amount)', 'amount')
        .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
        .groupBy('payment.status')
        .getRawMany(),
      this.userRepo.count(),
      this.productRepo.count(),
    ]);

    return {
      ordersByStatus: orderStats,
      payments: paymentStats,
      totalUsers: userCount,
      totalProducts: productCount,
    };
  }
}
