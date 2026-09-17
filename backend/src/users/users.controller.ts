import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ListUsersDto, GetUserDto, UpdateUserDto, DeleteUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_COLD_ADMIN)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users_list_api')
  @ApiOperation({ summary: 'List all users with pagination' })
  list(@Body() dto: ListUsersDto) {
    return this.usersService.list(dto);
  }

  @Post('users_get_api')
  @ApiOperation({ summary: 'Get user by ID' })
  getById(@Body() dto: GetUserDto) {
    return this.usersService.getById(dto.id);
  }

  @Post('users_update_api')
  @ApiOperation({ summary: 'Update user' })
  update(@Body() dto: UpdateUserDto) {
    return this.usersService.update(dto);
  }

  @Post('users_delete_api')
  @ApiOperation({ summary: 'Soft delete user' })
  remove(@Body() dto: DeleteUserDto) {
    return this.usersService.remove(dto.id);
  }
}
