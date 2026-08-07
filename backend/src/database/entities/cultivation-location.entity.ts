import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('cultivation_locations')
@Index(['name'])
export class CultivationLocation extends BaseEntity {
  @Column({ length: 200 })
  name: string;

  @Column({ length: 100, nullable: true })
  region: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
