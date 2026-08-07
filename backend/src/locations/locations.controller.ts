import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import {
  CreateLocationDto,
  UpdateLocationDto,
  ListLocationsDto,
  LocationIdDto,
} from './dto/location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Public()
  @Post('list')
  @ApiOperation({ summary: 'List cultivation locations' })
  list(@Body() dto: ListLocationsDto) {
    return this.locationsService.list(dto);
  }

  @Public()
  @Post('get')
  @ApiOperation({ summary: 'Get location by ID' })
  getById(@Body() dto: LocationIdDto) {
    return this.locationsService.getById(dto.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('create')
  @ApiOperation({ summary: 'Create cultivation location' })
  create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('update')
  @ApiOperation({ summary: 'Update cultivation location' })
  update(@Body() dto: UpdateLocationDto) {
    return this.locationsService.update(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('delete')
  @ApiOperation({ summary: 'Delete cultivation location' })
  remove(@Body() dto: LocationIdDto) {
    return this.locationsService.remove(dto.id);
  }
}
