import { IsNotEmpty, IsOptional, IsString, IsInt, IsNumber, IsArray, ArrayNotEmpty, IsUrl } from 'class-validator';

export class CreateProductDto {
    @IsString({ message: 'Mã sản phẩm phải là chuỗi.' })
    @IsNotEmpty({ message: 'Mã sản phẩm không được để trống.' })
    code: string;

    @IsString({ message: 'Tên sản phẩm phải là chuỗi.' })
    @IsNotEmpty({ message: 'Tên sản phẩm không được để trống.' })
    name: string;

    @IsOptional()
    @IsString({ message: 'Mô tả phải là chuỗi.' })
    description?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Giá phải là số.' })
    price?: number;

    @IsOptional()
    @IsInt({ message: 'Thứ tự hiển thị phải là số nguyên.' })
    sortOrder?: number;

    @IsNotEmpty({ message: 'Danh mục không hợp lệ.' })
    @IsInt({ message: 'Danh mục không hợp lệ.' })
    categoryId: number;

    @IsOptional()
    @IsString({ message: 'Ảnh chính phải là chuỗi (URL hoặc tên file).' })
    primaryImage?: string;

    @IsOptional()
    @IsArray({ message: 'Gallery phải là mảng.' })
    @IsString({ each: true, message: 'Mỗi ảnh trong gallery phải là chuỗi.' })
    gallery?: string[];
}
