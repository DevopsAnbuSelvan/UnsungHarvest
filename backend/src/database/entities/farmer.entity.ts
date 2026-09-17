import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SellerProfile } from './seller-profile.entity';
import { Product } from './product.entity';

@Entity('farmers')
@Index(['sellerId'])
@Index(['name'])
export class Farmer extends BaseEntity {
  @Column({ length: 150 })
  name: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 150, nullable: true })
  village: string;

  @Column({ length: 100, nullable: true })
  district: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ name: 'farm_size', length: 50, nullable: true })
  farmSize: string;

  @Column({ type: 'text', nullable: true })
  crops: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl: string;

  /** Student (seller) who manages / lists this farmer's harvest */
  @Column({ name: 'seller_id', type: 'uuid' })
  sellerId: string;

  @ManyToOne(() => SellerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: SellerProfile;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.farmer)
  products: Product[];
}
