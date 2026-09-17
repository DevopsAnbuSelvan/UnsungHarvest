import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerProfile, Address, User } from '../database/entities';
import { BuyersController } from './buyers.controller';
import { BuyersService } from './buyers.service';
import { AuthModule } from '../auth/auth.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BuyerProfile, Address, User]),
    AuthModule,
    FirebaseModule,
  ],
  controllers: [BuyersController],
  providers: [BuyersService],
  exports: [BuyersService],
})
export class BuyersModule {}
