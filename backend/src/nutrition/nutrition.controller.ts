import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NutritionService } from './nutrition.service';
import {
  CreateNutritionDto,
  UpdateNutritionDto,
  ListNutritionDto,
  NutritionIdDto,
} from './dto/nutrition.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Nutrition')
@Controller('nutrition')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Public()
  @Post('list')
  @ApiOperation({ summary: 'List nutrition information' })
  list(@Body() dto: ListNutritionDto) {
    return this.nutritionService.list(dto);
  }

  @Public()
  @Post('get')
  @ApiOperation({ summary: 'Get nutrition by ID' })
  getById(@Body() dto: NutritionIdDto) {
    return this.nutritionService.getById(dto.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN, UserRole.SELLER)
  @Post('create')
  @ApiOperation({ summary: 'Create nutrition information' })
  create(@Body() dto: CreateNutritionDto) {
    return this.nutritionService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN, UserRole.SELLER)
  @Post('update')
  @ApiOperation({ summary: 'Update nutrition information' })
  update(@Body() dto: UpdateNutritionDto) {
    return this.nutritionService.update(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('delete')
  @ApiOperation({ summary: 'Delete nutrition information' })
  remove(@Body() dto: NutritionIdDto) {
    return this.nutritionService.remove(dto.id);
  }
}
