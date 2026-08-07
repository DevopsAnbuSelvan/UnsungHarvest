import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { CreateAdminDto, ListAdminsDto, AdminIdDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Admins')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_COLD_ADMIN)
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create admin user' })
  create(@Body() dto: CreateAdminDto) {
    return this.adminsService.create(dto);
  }

  @Post('list')
  @ApiOperation({ summary: 'List all admins' })
  list(@Body() dto: ListAdminsDto) {
    return this.adminsService.list(dto);
  }

  @Post('get')
  @ApiOperation({ summary: 'Get admin by ID' })
  getById(@Body() dto: AdminIdDto) {
    return this.adminsService.getById(dto.id);
  }
}
