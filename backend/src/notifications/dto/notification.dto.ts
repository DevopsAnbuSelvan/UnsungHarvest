import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListNotificationsDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}

export class NotificationIdDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;
}

export class MarkAllReadDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  confirm?: boolean;
}
