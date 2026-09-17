import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CreateFarmerDto {
  @ApiProperty({ example: 'Ramasamy' })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  village?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '2 acres' })
  @IsOptional()
  @IsString()
  farmSize?: string;

  @ApiPropertyOptional({ example: 'Millet, Ragi' })
  @IsOptional()
  @IsString()
  crops?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  /** Required when admin creates a farmer for a seller */
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  sellerId?: string;
}

export class UpdateFarmerDto extends CreateFarmerDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ListFarmersDto extends PaginationDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  sellerId?: string;
}

export class FarmerIdDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;
}
