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
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Post('list')
  @ApiOperation({ summary: 'List products with search and filters' })
  list(@Body() dto: ListProductsDto) {
    return this.productsService.list(dto);
  }

  @Public()
  @Post('get')
  @ApiOperation({ summary: 'Get product by ID' })
  getById(@Body() dto: ProductIdDto) {
    return this.productsService.getById(dto.id);
  }

  @Public()
  @Post('seasonal')
  @ApiOperation({ summary: 'List seasonal products for the current month' })
  listSeasonal(@Body() dto: ProductListLimitDto) {
    return this.productsService.listSeasonal(dto.limit);
  }

  @Public()
  @Post('gi-tagged')
  @ApiOperation({ summary: 'List GI-tagged products' })
  listGiTagged(@Body() dto: ProductListLimitDto) {
    return this.productsService.listGiTagged(dto.limit);
  }

  @Public()
  @Post('featured')
  @ApiOperation({ summary: 'List featured products' })
  listFeatured(@Body() dto: ProductListLimitDto) {
    return this.productsService.listFeatured(dto.limit);
  }

  @Public()
  @Post('trending')
  @ApiOperation({ summary: 'List trending products' })
  listTrending(@Body() dto: ProductListLimitDto) {
    return this.productsService.listTrending(dto.limit);
  }

  @Public()
  @Post('recent')
  @ApiOperation({ summary: 'List recently added products' })
  listRecent(@Body() dto: ProductListLimitDto) {
    return this.productsService.listRecent(dto.limit);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @Post('create')
  @ApiOperation({ summary: 'Create product (seller)' })
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @Post('update')
  @ApiOperation({ summary: 'Update product (seller)' })
  update(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @Post('delete')
  @ApiOperation({ summary: 'Delete product (seller)' })
  remove(
    @CurrentUser('sub') userId: string,
    @Body() dto: ProductIdDto,
  ) {
    return this.productsService.remove(userId, dto.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('approve')
  @ApiOperation({ summary: 'Approve product (admin)' })
  approve(
    @CurrentUser('sub') adminId: string,
    @Body() dto: ProductIdDto,
  ) {
    return this.productsService.approve(dto.id, adminId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('reject')
  @ApiOperation({ summary: 'Reject product (admin)' })
  reject(@Body() dto: ApproveProductDto) {
    return this.productsService.reject(dto);
  }
}
