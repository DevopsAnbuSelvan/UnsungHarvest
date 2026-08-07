import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductImage, SellerProfile } from '../database/entities';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private imageRepo: Repository<ProductImage>,
    @InjectRepository(SellerProfile)
    private sellerRepo: Repository<SellerProfile>,
    private configService: ConfigService,
  ) {}

  validateFile(file: Express.Multer.File) {
    const maxSize = this.configService.get<number>('upload.maxSize') || 5242880;
    const allowedExtensions = this.configService.get<string[]>('upload.allowedExtensions') || ['jpg', 'jpeg', 'png', 'webp'];

    if (!file) throw new BadRequestException('No file uploaded');
    if (file.size > maxSize) {
      throw new BadRequestException(`File size exceeds ${maxSize} bytes`);
    }

    const ext = extname(file.originalname).slice(1).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${allowedExtensions.join(', ')}`,
      );
    }
  }

  async uploadProductImages(
    userId: string,
    productId: string,
    files: Express.Multer.File[],
  ) {
    const seller = await this.sellerRepo.findOne({ where: { userId } });
    if (!seller) throw new ForbiddenException('Seller profile required');

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.sellerId !== seller.id) {
      throw new ForbiddenException('Not authorized');
    }

    const images: ProductImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.validateFile(file);
      const filename = `${uuidv4()}${extname(file.originalname)}`;
      const imageUrl = `/uploads/products/${filename}`;

      const image = this.imageRepo.create({
        productId,
        imageUrl,
        isPrimary: i === 0,
        sortOrder: i,
      });
      images.push(await this.imageRepo.save(image));
    }

    return images;
  }

  async deleteImage(userId: string, imageId: string) {
    const seller = await this.sellerRepo.findOne({ where: { userId } });
    if (!seller) throw new ForbiddenException('Seller profile required');

    const image = await this.imageRepo.findOne({
      where: { id: imageId },
      relations: ['product'],
    });
    if (!image) throw new NotFoundException('Image not found');
    if (image.product.sellerId !== seller.id) {
      throw new ForbiddenException('Not authorized');
    }

    await this.imageRepo.softDelete(imageId);
    return { message: 'Image deleted' };
  }
}
