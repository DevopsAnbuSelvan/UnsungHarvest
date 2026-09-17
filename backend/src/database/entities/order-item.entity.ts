import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
@Index(['orderId'])
@Index(['productId'])
export class OrderItem extends BaseEntity {
  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_name', length: 200 })
  productName: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @Column({ name: 'farmer_id', type: 'uuid', nullable: true })
  farmerId: string | null;

  @Column({ name: 'seller_id', type: 'uuid', nullable: true })
  sellerId: string | null;

  @Column({
    name: 'commission_percent',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 5,
  })
  commissionPercent: number;

  @Column({
    name: 'student_commission_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  studentCommissionAmount: number;

  @Column({
    name: 'farmer_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  farmerAmount: number;
}
