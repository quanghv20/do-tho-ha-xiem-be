import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Mã danh mục phải là chuỗi.' })
  @IsNotEmpty({ message: 'Mã danh mục không được để trống.' })
  code: string;

  @IsString({ message: 'Tên danh mục phải là chuỗi.' })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi.' })
  description?: string;

  @IsOptional()
  @IsInt({ message: 'Thứ tự sắp xếp phải là số nguyên.' })
  sortOrder?: number;
}
