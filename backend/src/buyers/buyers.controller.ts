import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BuyersService } from './buyers.service';
import {
  UpdateBuyerProfileDto,
  CreateAddressDto,
  ListAddressesDto,
  AddressIdDto,
} from './dto/buyer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Buyers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.BUYER)
@Controller('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @Post('profile/get')
  @ApiOperation({ summary: 'Get buyer profile' })
  getProfile(@CurrentUser('sub') userId: string) {
    return this.buyersService.getProfile(userId);
  }

  @Post('profile/update')
  @ApiOperation({ summary: 'Update buyer profile' })
  updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateBuyerProfileDto,
  ) {
    return this.buyersService.updateProfile(userId, dto);
  }

  @Post('addresses/create')
  @ApiOperation({ summary: 'Create shipping address' })
  createAddress(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateAddressDto,
  ) {
    return this.buyersService.createAddress(userId, dto);
  }

  @Post('addresses/list')
  @ApiOperation({ summary: 'List buyer addresses' })
  listAddresses(
    @CurrentUser('sub') userId: string,
    @Body() dto: ListAddressesDto,
  ) {
    return this.buyersService.listAddresses(userId, dto);
  }

  @Post('addresses/delete')
  @ApiOperation({ summary: 'Delete address' })
  deleteAddress(
    @CurrentUser('sub') userId: string,
    @Body() dto: AddressIdDto,
  ) {
    return this.buyersService.deleteAddress(userId, dto.id);
  }
}
