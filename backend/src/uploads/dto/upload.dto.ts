import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UploadProductImagesDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  productId: string;
}

export class DeleteImageDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  imageId: string;
}
