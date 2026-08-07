import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BuyerProfile } from './buyer-profile.entity';
import { Product } from './product.entity';

@Entity('cart')
@Unique(['buyerId', 'productId'])
@Index(['buyerId'])
export class Cart extends BaseEntity {
  @Column({ name: 'buyer_id', type: 'uuid' })
  buyerId: string;

  @ManyToOne(() => BuyerProfile, (buyer) => buyer.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buyer_id' })
  buyer: BuyerProfile;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
