import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto, WishlistItemIdDto, ListWishlistDto } from './dto/wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.BUYER)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('list')
  @ApiOperation({ summary: 'List wishlist items' })
  list(
    @CurrentUser('sub') userId: string,
    @Body() dto: ListWishlistDto,
  ) {
    return this.wishlistService.list(userId, dto);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add product to wishlist' })
  add(
    @CurrentUser('sub') userId: string,
    @Body() dto: AddToWishlistDto,
  ) {
    return this.wishlistService.add(userId, dto);
  }

  @Post('remove')
  @ApiOperation({ summary: 'Remove from wishlist' })
  remove(
    @CurrentUser('sub') userId: string,
    @Body() dto: WishlistItemIdDto,
  ) {
    return this.wishlistService.remove(userId, dto.id);
  }
}
