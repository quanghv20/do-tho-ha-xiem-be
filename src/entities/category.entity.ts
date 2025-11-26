import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

@Entity('category')
export class Category extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true, type: 'int', name: 'sort_order', nullable: true })
  sortOrder: number;
}
