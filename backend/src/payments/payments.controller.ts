import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, PaymentIdDto, ListPaymentsDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(UserRole.BUYER)
  @Post('payments_create_api')
  @ApiOperation({ summary: 'Initiate payment for order' })
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(userId, dto);
  }

  @Roles(UserRole.BUYER)
  @Post('payments_get_api')
  @ApiOperation({ summary: 'Get payment by ID' })
  getById(@Body() dto: PaymentIdDto) {
    return this.paymentsService.getById(dto.id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('payments_list_api')
  @ApiOperation({ summary: 'List all payments' })
  list(@Body() dto: ListPaymentsDto) {
    return this.paymentsService.list(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
  @Post('payments_confirm_api')
  @ApiOperation({ summary: 'Confirm payment' })
  confirm(@Body() dto: PaymentIdDto) {
    return this.paymentsService.confirm(dto.id);
  }
}
