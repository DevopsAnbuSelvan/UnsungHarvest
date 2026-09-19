import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  UserRole.ADMIN,
  UserRole.SUPER_COLD_ADMIN,
  UserRole.SELLER,
  UserRole.BUYER,
)
@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post('dashboard_stats_api')
  @ApiOperation({
    summary: 'Dashboard stats (admin / seller / buyer scoped)',
  })
  getStats(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.dashboardService.getStatsForUser(userId, role);
  }
}
