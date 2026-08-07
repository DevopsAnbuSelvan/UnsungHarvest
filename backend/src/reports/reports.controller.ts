import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { SalesReportDto, AnalyticsDto } from './dto/report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_COLD_ADMIN)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('sales')
  @ApiOperation({ summary: 'Generate sales report' })
  salesReport(@Body() dto: SalesReportDto) {
    return this.reportsService.salesReport(dto);
  }

  @Post('top-products')
  @ApiOperation({ summary: 'Get top selling products' })
  topProducts() {
    return this.reportsService.topProducts();
  }

  @Post('analytics')
  @ApiOperation({ summary: 'Get platform analytics' })
  analytics(@Body() dto: AnalyticsDto) {
    return this.reportsService.analytics(dto);
  }
}
