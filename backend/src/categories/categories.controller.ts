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
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Post('categories_list_api')
  @ApiOperation({ summary: 'List categories' })
  list(@Body() dto: ListCategoriesDto) {
    return this.categoriesService.list(dto);
  }

  @Public()
  @Post('categories_get_api')
  @ApiOperation({ summary: 'Get category by ID' })
  getById(@Body() dto: CategoryIdDto) {
    return this.categoriesService.getById(dto.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('categories_create_api')
  @ApiOperation({ summary: 'Create category' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('categories_update_api')
  @ApiOperation({ summary: 'Update category' })
  update(@Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('categories_delete_api')
  @ApiOperation({ summary: 'Delete category' })
  remove(@Body() dto: CategoryIdDto) {
    return this.categoriesService.remove(dto.id);
  }
}
