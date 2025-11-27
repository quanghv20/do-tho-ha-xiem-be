import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../entities/category.entity';
import { Not, Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) { }

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Danh mục không tồn tại.');
    return category;
  }

  async validateUnique(dto: Partial<Category>, excludeId?: number) {
    if (dto.code) {
      const exists = await this.categoryRepo.findOne({
        where: {
          code: dto.code,
          ...(excludeId ? { id: Not(excludeId) } : {}),
        } as any,
      });
      if (exists) {
        throw new BadRequestException('Mã danh mục đã tồn tại.');
      }
    }

    if (dto.name) {
      const exists = await this.categoryRepo.findOne({
        where: {
          name: dto.name,
          ...(excludeId ? { id: Not(excludeId) } : {}),
        } as any,
      });
      if (exists) {
        throw new BadRequestException('Tên danh mục đã tồn tại.');
      }
    }

    if (dto.sortOrder !== undefined) {
      const exists = await this.categoryRepo.findOne({
        where: {
          sortOrder: dto.sortOrder,
          ...(excludeId ? { id: Not(excludeId) } : {}),
        } as any,
      });
      if (exists) {
        throw new BadRequestException('Thứ tự hiển thị đã tồn tại.');
      }
    }
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    await this.validateUnique(dto);

    const category = this.categoryRepo.create(dto);
    return await this.categoryRepo.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    await this.validateUnique(dto, id);

    Object.assign(category, dto);

    return await this.categoryRepo.save(category);
  }

  async delete(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
  }
}
