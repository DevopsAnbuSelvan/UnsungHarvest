import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BuyerProfile } from './buyer-profile.entity';
import { Product } from './product.entity';

@Entity('wishlist')
@Unique(['buyerId', 'productId'])
@Index(['buyerId'])
export class Wishlist extends BaseEntity {
  @Column({ name: 'buyer_id', type: 'uuid' })
  buyerId: string;

  @ManyToOne(() => BuyerProfile, (buyer) => buyer.wishlistItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buyer_id' })
  buyer: BuyerProfile;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.wishlistItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
