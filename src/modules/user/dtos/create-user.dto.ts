import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Tên đăng nhập phải là chuỗi.' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống.' })
  username: string;

  @IsString({ message: 'Họ tên phải là chuỗi.' })
  @IsNotEmpty({ message: 'Họ tên không được để trống.' })
  fullName: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi.' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Ảnh đại diện phải là chuỗi.' })
  avatarUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phải là true/false.' })
  isActive?: boolean;

  @IsString({ message: 'Mật khẩu không hợp lệ.' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  password: string;
}
