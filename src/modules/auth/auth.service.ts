import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const userFound = await this.userService.findByUsername(dto.username);

    if (!userFound) {
      throw new UnauthorizedException(
        'Tên tài khoản hoặc mật khẩu không chính xác.',
      );
    }

    // So sánh password plaintext với hash
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      userFound.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Tên tài khoản hoặc mật khẩu không chính xác.',
      );
    }

    // Tạo payload cho JWT (có thể thêm userId, role, etc.)
    const payload = { sub: userFound.id, username: userFound.username };

    const accessToken = this.jwtService.sign(payload);

    return {
      data: {
        accessToken: accessToken,
      },
      message: 'Đăng nhập thành công.',
      statusCode: 200,
    };
  }
}
