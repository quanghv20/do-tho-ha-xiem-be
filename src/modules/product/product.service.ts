import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(filter?: {
    code?: string;
    name?: string;
    categoryId?: number | string;
  }): Promise<Product[]> {
    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (filter?.code) {
      query.andWhere('LOWER(product.code) LIKE :code', {
        code: `%${filter.code.toLowerCase()}%`,
      });
    }

    if (filter?.name) {
      query.andWhere('LOWER(product.name) LIKE :name', {
        name: `%${filter.name.toLowerCase()}%`,
      });
    }

    if (filter?.categoryId) {
      query.andWhere('product.category_id = :categoryId', {
        categoryId: filter.categoryId,
      });
    }

    return await query.getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại.');
    return product;
  }

  async validateUnique(dto: Partial<Product>, excludeId?: number) {
    if (dto.code) {
      const exists = await this.productRepo.findOne({
        where: {
          code: dto.code,
          ...(excludeId ? { id: Not(excludeId) } : {}),
        },
      });
      if (exists) throw new BadRequestException('Mã sản phẩm đã tồn tại.');
    }

    if (dto.name) {
      const exists = await this.productRepo.findOne({
        where: {
          name: dto.name,
          ...(excludeId ? { id: Not(excludeId) } : {}),
        },
      });
      if (exists) throw new BadRequestException('Tên sản phẩm đã tồn tại.');
    }

    if (dto.sortOrder !== undefined) {
      const exists = await this.productRepo.findOne({
        where: {
          sortOrder: dto.sortOrder,
          ...(excludeId ? { id: Not(excludeId) } : {}),
        },
      });
      if (exists) throw new BadRequestException('Thứ tự hiển thị đã tồn tại.');
    }
  }

  async create(dto: CreateProductDto): Promise<Product> {
    await this.validateUnique(dto);

    // Validate category tồn tại
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });
    console.log('category: ', category);

    if (!category) {
      throw new BadRequestException('Danh mục không tồn tại.');
    }

    // Tạo product, map category
    const product = this.productRepo.create({
      ...dto,
      category, // ⚡ map relation
    });
    return await this.productRepo.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    await this.validateUnique(dto, id);

    Object.assign(product, dto);

    return await this.productRepo.save(product);
  }

  async delete(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }
}
