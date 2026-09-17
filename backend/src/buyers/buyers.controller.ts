import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BuyersService } from './buyers.service';
import {
  UpdateBuyerProfileDto,
  CreateAddressDto,
  ListAddressesDto,
  AddressIdDto,
  CreateBuyerDto,
  AdminUpdateBuyerDto,
  BuyerIdDto,
  ListBuyersDto,
} from './dto/buyer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Buyers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @Roles(UserRole.BUYER)
  @Post('buyers_profile_get_api')
  @ApiOperation({ summary: 'Get buyer profile' })
  getProfile(@CurrentUser('sub') userId: string) {
    return this.buyersService.getProfile(userId);
  }

  @Roles(UserRole.BUYER)
  @Post('buyers_profile_update_api')
  @ApiOperation({ summary: 'Update buyer profile' })
  updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateBuyerProfileDto,
  ) {
    return this.buyersService.updateProfile(userId, dto);
  }

  @Roles(UserRole.BUYER)
  @Post('buyers_addresses_create_api')
  @ApiOperation({ summary: 'Create shipping address' })
  createAddress(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateAddressDto,
  ) {
    return this.buyersService.createAddress(userId, dto);
  }

  @Roles(UserRole.BUYER)
  @Post('buyers_addresses_list_api')
  @ApiOperation({ summary: 'List buyer addresses' })
  listAddresses(
    @CurrentUser('sub') userId: string,
    @Body() dto: ListAddressesDto,
  ) {
    return this.buyersService.listAddresses(userId, dto);
  }

  @Roles(UserRole.BUYER)
  @Post('buyers_addresses_delete_api')
  @ApiOperation({ summary: 'Delete address' })
  deleteAddress(
    @CurrentUser('sub') userId: string,
    @Body() dto: AddressIdDto,
  ) {
    return this.buyersService.deleteAddress(userId, dto.id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('buyers_list_api')
  @ApiOperation({ summary: 'List all buyers (admin)' })
  list(@Body() dto: ListBuyersDto) {
    return this.buyersService.list(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('buyers_get_api')
  @ApiOperation({ summary: 'Get buyer by user ID (admin)' })
  getById(@Body() dto: BuyerIdDto) {
    return this.buyersService.getByUserId(dto.id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('buyers_create_api')
  @ApiOperation({ summary: 'Create buyer (admin)' })
  create(@Body() dto: CreateBuyerDto) {
    return this.buyersService.create(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('buyers_update_api')
  @ApiOperation({ summary: 'Update buyer (admin)' })
  adminUpdate(@Body() dto: AdminUpdateBuyerDto) {
    return this.buyersService.adminUpdate(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('buyers_delete_api')
  @ApiOperation({ summary: 'Delete buyer (admin)' })
  remove(@Body() dto: BuyerIdDto) {
    return this.buyersService.remove(dto.id);
  }
}
