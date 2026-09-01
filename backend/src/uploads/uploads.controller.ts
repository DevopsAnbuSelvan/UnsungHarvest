import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { UploadProductImagesDto, DeleteImageDto } from './dto/upload.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SELLER)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('product-images')
  @ApiOperation({ summary: 'Upload product images (max 5)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: memoryStorage(),
    }),
  )
  uploadProductImages(
    @CurrentUser('sub') userId: string,
    @Body() dto: UploadProductImagesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.uploadsService.uploadProductImages(userId, dto.productId, files);
  }

  @Post('delete-image')
  @ApiOperation({ summary: 'Delete product image' })
  deleteImage(
    @CurrentUser('sub') userId: string,
    @Body() dto: DeleteImageDto,
  ) {
    return this.uploadsService.deleteImage(userId, dto.imageId);
  }
}
