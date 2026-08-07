import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('seasons')
@Index(['name'], { unique: true })
export class Season extends BaseEntity {
  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'start_month', type: 'int', nullable: true })
  startMonth: number;

  @Column({ name: 'end_month', type: 'int', nullable: true })
  endMonth: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
