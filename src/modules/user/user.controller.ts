import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return {
      statusCode: 200,
      message: 'Danh sách người dùng',
      data,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: 422 })) id: number,
  ) {
    const data = await this.userService.findOne(id);
    return {
      statusCode: 200,
      message: 'Chi tiết người dùng',
      data,
    };
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const data = await this.userService.create(dto);
    return {
      statusCode: 201,
      message: 'Tạo người dùng thành công',
      data,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const data = await this.userService.update(id, dto);
    return {
      statusCode: 200,
      message: 'Cập nhật người dùng thành công',
      data,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.userService.delete(id);
    return {
      statusCode: 200,
      message: 'Xoá người dùng thành công',
      data: null,
    };
  }
}
