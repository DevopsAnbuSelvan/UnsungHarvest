import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, CartItemIdDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.BUYER)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('get')
  @ApiOperation({ summary: 'Get cart items' })
  getCart(@CurrentUser('sub') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(
    @CurrentUser('sub') userId: string,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addItem(userId, dto);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(userId, dto);
  }

  @Post('remove')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(
    @CurrentUser('sub') userId: string,
    @Body() dto: CartItemIdDto,
  ) {
    return this.cartService.removeItem(userId, dto.id);
  }

  @Post('clear')
  @ApiOperation({ summary: 'Clear entire cart' })
  clearCart(@CurrentUser('sub') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
