import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SellersService } from './sellers.service';
import {
  UpdateSellerProfileDto,
  ListSellersDto,
  ApproveSellerDto,
  SellerIdDto,
} from './dto/seller.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Sellers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Roles(UserRole.SELLER)
  @Post('profile/get')
  @ApiOperation({ summary: 'Get seller profile' })
  getProfile(@CurrentUser('sub') userId: string) {
    return this.sellersService.getProfile(userId);
  }

  @Roles(UserRole.SELLER)
  @Post('profile/update')
  @ApiOperation({ summary: 'Update seller profile' })
  updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateSellerProfileDto,
  ) {
    return this.sellersService.updateProfile(userId, dto);
  }

  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('list')
  @ApiOperation({ summary: 'List all sellers' })
  list(@Body() dto: ListSellersDto) {
    return this.sellersService.list(dto);
  }

  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('approve')
  @ApiOperation({ summary: 'Approve seller' })
  approve(
    @CurrentUser('sub') adminId: string,
    @Body() dto: SellerIdDto,
  ) {
    return this.sellersService.approve(dto.id, adminId);
  }

  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('reject')
  @ApiOperation({ summary: 'Reject seller' })
  reject(@Body() dto: ApproveSellerDto) {
    return this.sellersService.reject(dto);
  }
}
