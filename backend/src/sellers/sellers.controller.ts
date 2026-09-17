import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SellersService } from './sellers.service';
import {
  UpdateSellerProfileDto,
  ListSellersDto,
  ApproveSellerDto,
  SellerIdDto,
  CreateSellerDto,
  AdminUpdateSellerDto,
} from './dto/seller.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Sellers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Roles(UserRole.SELLER)
  @Post('sellers_profile_get_api')
  @ApiOperation({ summary: 'Get seller profile' })
  getProfile(@CurrentUser('sub') userId: string) {
    return this.sellersService.getProfile(userId);
  }

  @Roles(UserRole.SELLER)
  @Post('sellers_profile_update_api')
  @ApiOperation({ summary: 'Update seller profile' })
  updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateSellerProfileDto,
  ) {
    return this.sellersService.updateProfile(userId, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('sellers_list_api')
  @ApiOperation({ summary: 'List all sellers' })
  list(@Body() dto: ListSellersDto) {
    return this.sellersService.list(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('sellers_get_api')
  @ApiOperation({ summary: 'Get seller by profile ID' })
  getById(@Body() dto: SellerIdDto) {
    return this.sellersService.getById(dto.id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('sellers_create_api')
  @ApiOperation({ summary: 'Create seller (admin)' })
  create(@Body() dto: CreateSellerDto) {
    return this.sellersService.create(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('sellers_update_api')
  @ApiOperation({ summary: 'Update seller (admin)' })
  adminUpdate(@Body() dto: AdminUpdateSellerDto) {
    return this.sellersService.adminUpdate(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('sellers_delete_api')
  @ApiOperation({ summary: 'Delete seller (admin)' })
  remove(@Body() dto: SellerIdDto) {
    return this.sellersService.remove(dto.id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('sellers_approve_api')
  @ApiOperation({ summary: 'Approve seller' })
  approve(
    @CurrentUser('sub') adminId: string,
    @Body() dto: SellerIdDto,
  ) {
    return this.sellersService.approve(dto.id, adminId);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('sellers_reject_api')
  @ApiOperation({ summary: 'Reject seller' })
  reject(@Body() dto: ApproveSellerDto) {
    return this.sellersService.reject(dto);
  }
}
