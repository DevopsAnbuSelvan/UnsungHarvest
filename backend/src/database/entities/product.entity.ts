import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { GiStatus, ProductStatus } from '../../common/enums';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { SellerProfile } from './seller-profile.entity';
import { ProductImage } from './product-image.entity';
import { NutritionInformation } from './nutrition-information.entity';
import { Season } from './season.entity';
import { CultivationLocation } from './cultivation-location.entity';
import { OrderItem } from './order-item.entity';
import { Cart } from './cart.entity';
import { Wishlist } from './wishlist.entity';

@Entity('products')
@Index(['sellerId'])
@Index(['categoryId'])
@Index(['status'])
@Index(['name'])
export class Product extends BaseEntity {
  @Column({ length: 200 })
  name: string;

  @Column({ name: 'local_name', length: 200, nullable: true })
  localName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'seller_id', type: 'uuid' })
  sellerId: string;

  @ManyToOne(() => SellerProfile, (seller) => seller.products)
  @JoinColumn({ name: 'seller_id' })
  seller: SellerProfile;

  @Column({ name: 'nutrition_id', type: 'uuid', nullable: true })
  nutritionId: string;

  @OneToOne(() => NutritionInformation, { nullable: true, eager: false })
  @JoinColumn({ name: 'nutrition_id' })
  nutrition: NutritionInformation;

  @Column({ name: 'season_id', type: 'uuid', nullable: true })
  seasonId: string;

  @ManyToOne(() => Season, { nullable: true })
  @JoinColumn({ name: 'season_id' })
  season: Season;

  @Column({
    name: 'gi_status',
    type: 'enum',
    enum: GiStatus,
    default: GiStatus.NOT_APPLICABLE,
  })
  giStatus: GiStatus;

  @Column({ name: 'cultivation_location_id', type: 'uuid', nullable: true })
  cultivationLocationId: string;

  @ManyToOne(() => CultivationLocation, { nullable: true })
  @JoinColumn({ name: 'cultivation_location_id' })
  cultivationLocation: CultivationLocation;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PENDING,
  })
  status: ProductStatus;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string | null;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems: OrderItem[];

  @OneToMany(() => Cart, (cart) => cart.product)
  cartItems: Cart[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlistItems: Wishlist[];
}
