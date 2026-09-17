import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import {
  CreateAdminDto,
  ListAdminsDto,
  AdminIdDto,
  UpdateAdminDto,
} from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Admins')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_COLD_ADMIN)
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('admins_create_api')
  @ApiOperation({ summary: 'Create Admin (role=admin)' })
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Post('admins_list_api')
  @ApiOperation({ summary: 'List Admins (role=admin)' })
  list(@Body() dto: ListAdminsDto) {
    return this.adminService.list(dto);
  }

  @Post('admins_get_api')
  @ApiOperation({ summary: 'Get Admin by ID' })
  getById(@Body() dto: AdminIdDto) {
    return this.adminService.getById(dto.id);
  }

  @Post('admins_update_api')
  @ApiOperation({ summary: 'Update Admin' })
  update(@Body() dto: UpdateAdminDto) {
    return this.adminService.update(dto);
  }

  @Post('admins_delete_api')
  @ApiOperation({ summary: 'Delete Admin' })
  remove(@Body() dto: AdminIdDto) {
    return this.adminService.remove(dto.id);
  }
}
