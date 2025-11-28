import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user: { userId: number; username: string } = req.user;

    const userProfile = await this.userService.findOne(user.userId);

    return {
      data: userProfile,
      message: 'Thông tin người dùng',
      statusCode: 200,
    };
  }
}
