import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [ProfileController],
  providers: [UserService],
})
export class ProfileModule {}
