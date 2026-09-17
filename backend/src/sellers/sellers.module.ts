import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerProfile, User } from '../database/entities';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';
import { AuthModule } from '../auth/auth.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellerProfile, User]),
    AuthModule,
    FirebaseModule,
  ],
  controllers: [SellersController],
  providers: [SellersService],
  exports: [SellersService],
})
export class SellersModule {}
