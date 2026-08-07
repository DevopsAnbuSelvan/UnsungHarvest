import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  ListOrdersDto,
  OrderIdDto,
  UpdateOrderStatusDto,
} from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRole.BUYER)
  @Post('create')
  @ApiOperation({ summary: 'Create order from cart items' })
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(userId, dto);
  }

  @Roles(UserRole.BUYER)
  @Post('my-orders')
  @ApiOperation({ summary: 'List buyer orders' })
  myOrders(
    @CurrentUser('sub') userId: string,
    @Body() dto: ListOrdersDto,
  ) {
    return this.ordersService.listForBuyer(userId, dto);
  }

  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('list')
  @ApiOperation({ summary: 'List all orders (admin)' })
  listAll(@Body() dto: ListOrdersDto) {
    return this.ordersService.listAll(dto);
  }

  @Post('get')
  @ApiOperation({ summary: 'Get order by ID' })
  getById(@Body() dto: OrderIdDto) {
    return this.ordersService.getById(dto.id);
  }

  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('update-status')
  @ApiOperation({ summary: 'Update order status (admin)' })
  updateStatus(@Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(dto);
  }
}
