import { Column, Entity, Index, OneToOne } from 'typeorm';
import { UserRole, UserStatus } from '../../common/enums';
import { BaseEntity } from './base.entity';
import { BuyerProfile } from './buyer-profile.entity';
import { SellerProfile } from './seller-profile.entity';
import { AdminProfile } from './admin-profile.entity';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['role'])
@Index(['status'])
export class User extends BaseEntity {
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'email_verification_token', type: 'varchar', nullable: true, select: false })
  emailVerificationToken: string | null;

  @Column({ name: 'password_reset_token', type: 'varchar', nullable: true, select: false })
  passwordResetToken: string | null;

  @Column({ name: 'password_reset_expires', type: 'timestamptz', nullable: true, select: false })
  passwordResetExpires: Date | null;

  @Column({ name: 'refresh_token_hash', type: 'varchar', nullable: true, select: false })
  refreshTokenHash: string | null;

  @OneToOne(() => BuyerProfile, (profile) => profile.user)
  buyerProfile: BuyerProfile;

  @OneToOne(() => SellerProfile, (profile) => profile.user)
  sellerProfile: SellerProfile;

  @OneToOne(() => AdminProfile, (profile) => profile.user)
  adminProfile: AdminProfile;
}
