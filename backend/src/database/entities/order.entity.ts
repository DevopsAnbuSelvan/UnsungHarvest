import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderStatus } from '../../common/enums';
import { BaseEntity } from './base.entity';
import { BuyerProfile } from './buyer-profile.entity';
import { OrderItem } from './order-item.entity';
import { Address } from './address.entity';

@Entity('orders')
@Index(['buyerId'])
@Index(['status'])
@Index(['orderNumber'], { unique: true })
export class Order extends BaseEntity {
  @Column({ name: 'order_number', length: 50, unique: true })
  orderNumber: string;

  @Column({ name: 'buyer_id', type: 'uuid' })
  buyerId: string;

  @ManyToOne(() => BuyerProfile, (buyer) => buyer.orders)
  @JoinColumn({ name: 'buyer_id' })
  buyer: BuyerProfile;

  @Column({ name: 'shipping_address_id', type: 'uuid', nullable: true })
  shippingAddressId: string;

  @ManyToOne(() => Address, { nullable: true })
  @JoinColumn({ name: 'shipping_address_id' })
  shippingAddress: Address;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ name: 'subtotal', type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ name: 'shipping_fee', type: 'decimal', precision: 12, scale: 2, default: 0 })
  shippingFee: number;

  @Column({ name: 'tax', type: 'decimal', precision: 12, scale: 2, default: 0 })
  tax: number;

  @Column({ name: 'total', type: 'decimal', precision: 12, scale: 2 })
  total: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
