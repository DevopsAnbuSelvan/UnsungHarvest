import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  Order,
  OrderItem,
  Product,
  BuyerProfile,
} from '../database/entities';
import { OrderStatus, ProductStatus } from '../common/enums';
import { CreateOrderDto, ListOrdersDto, UpdateOrderStatusDto } from './dto/order.dto';
import { buildPaginatedResult, generateOrderNumber } from '../common/utils/helpers';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(BuyerProfile)
    private buyerRepo: Repository<BuyerProfile>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const buyer = await this.buyerRepo.findOne({ where: { userId } });
    if (!buyer) throw new NotFoundException('Buyer profile not found');

    return this.dataSource.transaction(async (manager) => {
      let subtotal = 0;
      const orderItems: Partial<OrderItem>[] = [];

      for (const item of dto.items) {
        const product = await manager.findOne(Product, { where: { id: item.productId } });
        if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
        if (product.status !== ProductStatus.APPROVED) {
          throw new BadRequestException(`Product ${product.name} is not available`);
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }

        const unitPrice = Number(product.price);
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        orderItems.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });

        await manager.decrement(Product, { id: product.id }, 'stock', item.quantity);
      }

      const shippingFee = 0;
      const tax = subtotal * 0.05;
      const total = subtotal + shippingFee + tax;

      const order = manager.create(Order, {
        orderNumber: generateOrderNumber(),
        buyerId: buyer.id,
        shippingAddressId: dto.shippingAddressId,
        status: OrderStatus.PENDING,
        subtotal,
        shippingFee,
        tax,
        total,
        notes: dto.notes,
      });

      const savedOrder = await manager.save(Order, order);

      for (const item of orderItems) {
        await manager.save(OrderItem, { ...item, orderId: savedOrder.id });
      }

      return manager.findOne(Order, {
        where: { id: savedOrder.id },
        relations: ['items', 'items.product', 'shippingAddress'],
      });
    });
  }

  async listForBuyer(userId: string, dto: ListOrdersDto) {
    const buyer = await this.buyerRepo.findOne({ where: { userId } });
    if (!buyer) throw new NotFoundException('Buyer profile not found');
    return this.listOrders({ ...dto, buyerId: buyer.id });
  }

  async listAll(dto: ListOrdersDto) {
    return this.listOrders(dto);
  }

  private async listOrders(dto: ListOrdersDto & { buyerId?: string }) {
    const { page = 1, limit = 10, status, buyerId } = dto;
    const qb = this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.buyer', 'buyer')
      .leftJoinAndSelect('buyer.user', 'user');

    if (status) qb.andWhere('order.status = :status', { status });
    if (buyerId) qb.andWhere('order.buyerId = :buyerId', { buyerId });

    qb.orderBy('order.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'buyer', 'buyer.user', 'shippingAddress'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(dto: UpdateOrderStatusDto) {
    await this.getById(dto.id);
    await this.orderRepo.update(dto.id, { status: dto.status });
    return this.getById(dto.id);
  }
}
