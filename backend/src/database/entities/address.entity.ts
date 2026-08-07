import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AddressType } from '../../common/enums';
import { BaseEntity } from './base.entity';
import { BuyerProfile } from './buyer-profile.entity';

@Entity('addresses')
@Index(['buyerId'])
export class Address extends BaseEntity {
  @Column({ name: 'buyer_id', type: 'uuid' })
  buyerId: string;

  @ManyToOne(() => BuyerProfile, (buyer) => buyer.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buyer_id' })
  buyer: BuyerProfile;

  @Column({ length: 100 })
  label: string;

  @Column({
    type: 'enum',
    enum: AddressType,
    default: AddressType.HOME,
  })
  type: AddressType;

  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ name: 'address_line1', length: 255 })
  addressLine1: string;

  @Column({ name: 'address_line2', length: 255, nullable: true })
  addressLine2: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ name: 'postal_code', length: 20 })
  postalCode: string;

  @Column({ length: 100, default: 'India' })
  country: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;
}
