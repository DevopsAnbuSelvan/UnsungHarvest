import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FarmersService } from './farmers.service';
import {
  CreateFarmerDto,
  FarmerIdDto,
  ListFarmersDto,
  UpdateFarmerDto,
} from './dto/farmer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Farmers')
@Controller()
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('farmers_create_api')
  @ApiOperation({ summary: 'Create farmer (student/seller)' })
  create(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: CreateFarmerDto,
  ) {
    return this.farmersService.create(userId, role, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('farmers_list_api')
  @ApiOperation({ summary: 'List farmers for student/admin' })
  list(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: ListFarmersDto,
  ) {
    return this.farmersService.list(userId, role, dto);
  }

  @Public()
  @Post('farmers_get_api')
  @ApiOperation({ summary: 'Get farmer by ID' })
  getById(@Body() dto: FarmerIdDto) {
    return this.farmersService.getById(dto.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('farmers_update_api')
  @ApiOperation({ summary: 'Update farmer' })
  update(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: UpdateFarmerDto,
  ) {
    return this.farmersService.update(userId, role, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('farmers_delete_api')
  @ApiOperation({ summary: 'Delete farmer' })
  remove(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: FarmerIdDto,
  ) {
    return this.farmersService.remove(userId, role, dto.id);
  }
}
