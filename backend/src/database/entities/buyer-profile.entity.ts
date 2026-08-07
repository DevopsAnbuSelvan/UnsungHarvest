import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Address } from './address.entity';
import { Order } from './order.entity';
import { Cart } from './cart.entity';
import { Wishlist } from './wishlist.entity';

@Entity('buyer_profiles')
export class BuyerProfile extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToOne(() => User, (user) => user.buyerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @OneToMany(() => Address, (address) => address.buyer)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.buyer)
  cartItems: Cart[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.buyer)
  wishlistItems: Wishlist[];
}
