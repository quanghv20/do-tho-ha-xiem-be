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
import * as bcrypt from 'bcrypt';

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
        },
      });
      if (exists) throw new BadRequestException('Tên đăng nhập đã tồn tại.');
    }

    // email
    if (dto.email) {
      const exists = await this.userRepo.findOne({
        where: {
          email: dto.email,
          ...(excludeId ? { id: Not(excludeId) } : {}),
        },
      });
      if (exists) throw new BadRequestException('Email đã tồn tại.');
    }

    // phone
    if (dto.phone) {
      const exists = await this.userRepo.findOne({
        where: {
          phone: dto.phone,
          ...(excludeId ? { id: Not(excludeId) } : {}),
        },
      });
      if (exists) throw new BadRequestException('Số điện thoại đã tồn tại.');
    }
  }

  async findAll(): Promise<Partial<User>[]> {
    const usersFound = await this.userRepo.find();
    return usersFound.map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = u;
      return rest;
    });
  }

  async findOne(id: number) {
    const userFound = await this.userRepo.findOne({ where: { id } });
    if (!userFound) throw new NotFoundException('Người dùng không tồn tại.');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = userFound;
    return rest;
  }

  async create(dto: CreateUserDto) {
    await this.validateUnique(dto);

    // 🔐 1. Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 2. Tạo user với password đã hash
    const userCreated = this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });

    const userSaved = await this.userRepo.save(userCreated);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = userSaved;
    return rest;
  }

  async update(id: number, dto: UpdateUserDto) {
    const userFound = await this.userRepo.findOne({ where: { id } });
    if (!userFound) throw new NotFoundException('Người dùng không tồn tại.');

    await this.validateUnique(dto, id);

    Object.assign(userFound, dto);
    const userSaved = await this.userRepo.save(userFound);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = userSaved;
    return rest;
  }

  async delete(id: number) {
    const userFound = await this.userRepo.findOne({ where: { id } });
    if (!userFound) throw new NotFoundException('Người dùng không tồn tại.');
    await this.userRepo.remove(userFound);
  }

  async findByUsername(username: string) {
    const userFound = await this.userRepo.findOne({ where: { username } });

    return userFound;
  }
}
