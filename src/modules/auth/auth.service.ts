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
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // refresh token dài hạn

    // Nếu muốn lưu refreshToken vào DB để thu hồi
    // await this.userService.saveRefreshToken(userFound.id, refreshToken);

    return {
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      message: 'Đăng nhập thành công.',
      statusCode: 200,
    };
  }

  async refreshToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(token); // Nếu token hết hạn sẽ throw
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại.');
      }

      const newPayload = { sub: user.id, username: user.username };
      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });
      const refreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      // Cập nhật refreshToken mới nếu lưu vào DB
      // await this.userService.saveRefreshToken(user.id, refreshToken);

      return {
        data: {
          accessToken,
          refreshToken,
        },
        message: 'Refresh token thành công.',
        statusCode: 200,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new UnauthorizedException('Refresh token không hợp lệ.');
    }
  }
}
