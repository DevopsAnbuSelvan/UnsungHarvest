import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('nutrition_information')
export class NutritionInformation extends BaseEntity {
  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  calories: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  protein: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  carbohydrates: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  fat: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  fiber: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  sugar: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  sodium: number;

  @Column({ type: 'jsonb', nullable: true })
  vitamins: Record<string, number>;

  @Column({ type: 'jsonb', nullable: true })
  minerals: Record<string, number>;

  @Column({ name: 'serving_size', length: 50, nullable: true })
  servingSize: string;
}
