import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class AddToWishlistDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  productId: string;
}

export class WishlistItemIdDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;
}

export class ListWishlistDto extends PaginationDto {}
