import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  async findAll(@Query('code') code?: string, @Query('name') name?: string) {
    const data = await this.categoryService.findAll({ code, name });
    return {
      statusCode: 200,
      message: 'Danh sách danh mục',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.categoryService.findOne(id);
    return {
      statusCode: 200,
      message: 'Chi tiết danh mục',
      data,
    };
  }

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    const data = await this.categoryService.create(dto);
    return {
      statusCode: 201,
      message: 'Tạo danh mục thành công',
      data,
    };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    const data = await this.categoryService.update(id, dto);
    return {
      statusCode: 200,
      message: 'Cập nhật danh mục thành công',
      data,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.delete(id);
    return {
      statusCode: 200,
      message: 'Xoá danh mục thành công',
      data: null,
    };
  }

}
