import { Column, Entity, Index, OneToOne } from 'typeorm';
import { UserRole, UserStatus } from '../../common/enums';
import { BaseEntity } from './base.entity';
import { BuyerProfile } from './buyer-profile.entity';
import { SellerProfile } from './seller-profile.entity';
import { AdminProfile } from './admin-profile.entity';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['firebaseUid'], { unique: true })
@Index(['role'])
@Index(['status'])
export class User extends BaseEntity {
  @Column({ name: 'firebase_uid', length: 128, unique: true })
  firebaseUid: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @OneToOne(() => BuyerProfile, (profile) => profile.user)
  buyerProfile: BuyerProfile;

  @OneToOne(() => SellerProfile, (profile) => profile.user)
  sellerProfile: SellerProfile;

  @OneToOne(() => AdminProfile, (profile) => profile.user)
  adminProfile: AdminProfile;
}
