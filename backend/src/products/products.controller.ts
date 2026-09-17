import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ListProductsDto,
  ProductIdDto,
  ApproveProductDto,
  ProductListLimitDto,
} from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Products')
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Post('products_list_api')
  @ApiOperation({ summary: 'List products with search and filters' })
  list(@Body() dto: ListProductsDto) {
    return this.productsService.list(dto);
  }

  @Public()
  @Post('products_get_api')
  @ApiOperation({ summary: 'Get product by ID' })
  getById(@Body() dto: ProductIdDto) {
    return this.productsService.getById(dto.id);
  }

  @Public()
  @Post('products_seasonal_api')
  @ApiOperation({ summary: 'List seasonal products for the current month' })
  listSeasonal(@Body() dto: ProductListLimitDto) {
    return this.productsService.listSeasonal(dto.limit);
  }

  @Public()
  @Post('products_gi_tagged_api')
  @ApiOperation({ summary: 'List GI-tagged products' })
  listGiTagged(@Body() dto: ProductListLimitDto) {
    return this.productsService.listGiTagged(dto.limit);
  }

  @Public()
  @Post('products_featured_api')
  @ApiOperation({ summary: 'List featured products' })
  listFeatured(@Body() dto: ProductListLimitDto) {
    return this.productsService.listFeatured(dto.limit);
  }

  @Public()
  @Post('products_trending_api')
  @ApiOperation({ summary: 'List trending products' })
  listTrending(@Body() dto: ProductListLimitDto) {
    return this.productsService.listTrending(dto.limit);
  }

  @Public()
  @Post('products_recent_api')
  @ApiOperation({ summary: 'List recently added products' })
  listRecent(@Body() dto: ProductListLimitDto) {
    return this.productsService.listRecent(dto.limit);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('products_create_api')
  @ApiOperation({ summary: 'Create product (seller or admin)' })
  create(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(userId, dto, role);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('products_update_api')
  @ApiOperation({ summary: 'Update product (seller or admin)' })
  update(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(userId, dto, role);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('products_delete_api')
  @ApiOperation({ summary: 'Delete product (seller or admin)' })
  remove(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: ProductIdDto,
  ) {
    return this.productsService.remove(userId, dto.id, role);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('products_approve_api')
  @ApiOperation({ summary: 'Approve product (admin)' })
  approve(
    @CurrentUser('sub') adminId: string,
    @Body() dto: ProductIdDto,
  ) {
    return this.productsService.approve(dto.id, adminId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('products_reject_api')
  @ApiOperation({ summary: 'Reject product (admin)' })
  reject(@Body() dto: ApproveProductDto) {
    return this.productsService.reject(dto);
  }
}
