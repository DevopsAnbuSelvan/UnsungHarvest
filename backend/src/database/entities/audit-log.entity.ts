import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('audit_logs')
@Index(['userId'])
@Index(['action'])
@Index(['entityType', 'entityId'])
export class AuditLog extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @Column({ length: 100 })
  action: string;

  @Column({ name: 'entity_type', length: 100 })
  entityType: string;

  @Column({ name: 'entity_id', type: 'uuid', nullable: true })
  entityId: string;

  @Column({ type: 'jsonb', nullable: true })
  oldValues: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  newValues: Record<string, unknown>;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;
}
