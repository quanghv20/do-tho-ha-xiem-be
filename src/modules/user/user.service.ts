import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async validateUnique(dto: Partial<User>, excludeId?: number) {
    // username
    if (dto.username) {
      const exists = await this.userRepo.findOne({
        where: {
          username: dto.username,
          ...(excludeId ? { id: Not(excludeId) } : {}),
        } as any,
      });
      if (exists) throw new BadRequestException('Tên đăng nhập đã tồn tại.');
    }

    // email
    if (dto.email) {
      const exists = await this.userRepo.findOne({
        where: {
          email: dto.email,
          ...(excludeId ? { id: Not(excludeId) } : {}),
        } as any,
      });
      if (exists) throw new BadRequestException('Email đã tồn tại.');
    }

    // phone
    if (dto.phone) {
      const exists = await this.userRepo.findOne({
        where: {
          phone: dto.phone,
          ...(excludeId ? { id: Not(excludeId) } : {}),
        } as any,
      });
      if (exists) throw new BadRequestException('Số điện thoại đã tồn tại.');
    }
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepo.find();
    return users.map((u) => {
      const { password, ...rest } = u;
      return rest;
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại.');

    const { password, ...rest } = user;
    return rest;
  }

  async create(dto: CreateUserDto) {
    await this.validateUnique(dto);

    const user = this.userRepo.create(dto);
    const saved = await this.userRepo.save(user);

    const { password, ...rest } = saved;
    return rest;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại.');

    await this.validateUnique(dto, id);

    Object.assign(user, dto);
    const saved = await this.userRepo.save(user);

    const { password, ...rest } = saved;
    return rest;
  }

  async delete(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại.');
    await this.userRepo.remove(user);
  }
}
