import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { PaymentMethod, PaymentStatus } from '../../common/enums';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity('payments')
@Index(['orderId'])
@Index(['status'])
export class Payment extends BaseEntity {
  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ length: 10, default: 'INR' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.COD,
  })
  method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ name: 'transaction_id', length: 100, nullable: true })
  transactionId: string;

  @Column({ name: 'payment_gateway', length: 50, nullable: true })
  paymentGateway: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;
}
