import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ApprovalStatus } from '../../common/enums';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('seller_profiles')
export class SellerProfile extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToOne(() => User, (user) => user.sellerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'business_name', length: 200 })
  businessName: string;

  @Column({ name: 'business_description', type: 'text', nullable: true })
  businessDescription: string;

  @Column({ name: 'gst_number', length: 50, nullable: true })
  gstNumber: string;

  @Column({ name: 'license_number', length: 100, nullable: true })
  licenseNumber: string;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  status: ApprovalStatus;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string | null;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];
}
