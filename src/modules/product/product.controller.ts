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
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async findAll(
        @Query('code') code?: string,
        @Query('name') name?: string,
        @Query('categoryId') categoryId?: string | number,
    ) {
        const data = await this.productService.findAll({ code, name, categoryId });
        return {
            statusCode: 200,
            message: 'Danh sách sản phẩm',
            data,
        };
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const data = await this.productService.findOne(id);
        return {
            statusCode: 200,
            message: 'Chi tiết sản phẩm',
            data,
        };
    }

    @Post()
    async create(@Body() dto: CreateProductDto) {
        const data = await this.productService.create(dto);
        return {
            statusCode: 201,
            message: 'Tạo sản phẩm thành công',
            data,
        };
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
        const data = await this.productService.update(id, dto);
        return {
            statusCode: 200,
            message: 'Cập nhật sản phẩm thành công',
            data,
        };
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.productService.delete(id);
        return {
            statusCode: 200,
            message: 'Xoá sản phẩm thành công',
            data: null,
        };
    }

}
