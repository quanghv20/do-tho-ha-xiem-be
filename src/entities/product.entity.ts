import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Category } from './category.entity';

@Entity('product')
export class Product extends BaseEntity {
    @Column({ unique: true })
    code: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    @Column({ unique: true, type: 'int', name: 'sort_order', nullable: true })
    sortOrder: number;

    @Column({ nullable: true })
    primaryImage: string; // ảnh chính

    @Column({ type: 'simple-json', nullable: true })
    gallery: string[]; // danh sách ảnh phụ

    @ManyToOne(() => Category, category => category.products, { nullable: false })
    @JoinColumn({ name: 'category_id' })
    category: Category;
}
