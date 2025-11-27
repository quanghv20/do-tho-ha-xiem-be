import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Product } from './product.entity';

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

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
