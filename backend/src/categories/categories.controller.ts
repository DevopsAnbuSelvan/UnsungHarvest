import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  ListCategoriesDto,
  CategoryIdDto,
} from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Post('list')
  @ApiOperation({ summary: 'List categories' })
  list(@Body() dto: ListCategoriesDto) {
    return this.categoriesService.list(dto);
  }

  @Public()
  @Post('get')
  @ApiOperation({ summary: 'Get category by ID' })
  getById(@Body() dto: CategoryIdDto) {
    return this.categoriesService.getById(dto.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('create')
  @ApiOperation({ summary: 'Create category' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('update')
  @ApiOperation({ summary: 'Update category' })
  update(@Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('delete')
  @ApiOperation({ summary: 'Delete category' })
  remove(@Body() dto: CategoryIdDto) {
    return this.categoriesService.remove(dto.id);
  }
}
