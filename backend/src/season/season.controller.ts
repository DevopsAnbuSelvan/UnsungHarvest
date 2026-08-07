import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SeasonService } from './season.service';
import { CreateSeasonDto, UpdateSeasonDto, ListSeasonsDto, SeasonIdDto } from './dto/season.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Season')
@Controller('season')
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @Public()
  @Post('list')
  @ApiOperation({ summary: 'List seasons' })
  list(@Body() dto: ListSeasonsDto) {
    return this.seasonService.list(dto);
  }

  @Public()
  @Post('get')
  @ApiOperation({ summary: 'Get season by ID' })
  getById(@Body() dto: SeasonIdDto) {
    return this.seasonService.getById(dto.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('create')
  @ApiOperation({ summary: 'Create season' })
  create(@Body() dto: CreateSeasonDto) {
    return this.seasonService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('update')
  @ApiOperation({ summary: 'Update season' })
  update(@Body() dto: UpdateSeasonDto) {
    return this.seasonService.update(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_COLD_ADMIN)
  @Post('delete')
  @ApiOperation({ summary: 'Delete season' })
  remove(@Body() dto: SeasonIdDto) {
    return this.seasonService.remove(dto.id);
  }
}
