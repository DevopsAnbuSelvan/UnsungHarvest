import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  User,
  BuyerProfile,
  SellerProfile,
  AdminProfile,
} from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BuyerProfile, SellerProfile, AdminProfile]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
