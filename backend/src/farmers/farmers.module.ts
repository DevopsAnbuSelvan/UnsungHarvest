import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmer, SellerProfile } from '../database/entities';
import { FarmersController } from './farmers.controller';
import { FarmersService } from './farmers.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer, SellerProfile]), AuthModule],
  controllers: [FarmersController],
  providers: [FarmersService],
  exports: [FarmersService],
})
export class FarmersModule {}
