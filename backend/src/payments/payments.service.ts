import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, Order } from '../database/entities';
import { PaymentStatus } from '../common/enums';
import { CreatePaymentDto, ListPaymentsDto } from './dto/payment.dto';
import { buildPaginatedResult } from '../common/utils/helpers';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  async create(userId: string, dto: CreatePaymentDto) {
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const payment = this.paymentRepo.create({
      orderId: dto.orderId,
      userId,
      amount: order.total,
      method: dto.method,
      transactionId: dto.transactionId,
      status: PaymentStatus.PENDING,
    });

    return this.paymentRepo.save(payment);
  }

  async confirm(id: string) {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    await this.paymentRepo.update(id, { status: PaymentStatus.COMPLETED });
    return this.paymentRepo.findOne({ where: { id }, relations: ['order'] });
  }

  async list(dto: ListPaymentsDto) {
    const { page = 1, limit = 10 } = dto;
    const [items, total] = await this.paymentRepo.findAndCount({
      relations: ['order', 'user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['order', 'user'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}
