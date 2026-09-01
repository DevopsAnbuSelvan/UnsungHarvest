import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { del, put } from '@vercel/blob';
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

  private get blobToken(): string | undefined {
    return this.configService.get<string>('upload.blobReadWriteToken');
  }

  private async storeFile(
    file: Express.Multer.File,
    productId: string,
  ): Promise<string> {
    const filename = `${uuidv4()}${extname(file.originalname)}`;
    const token = this.blobToken;

    if (token) {
      const blob = await put(`products/${productId}/${filename}`, file.buffer, {
        access: 'public',
        token,
        contentType: file.mimetype,
      });
      return blob.url;
    }

    const dest = join(process.cwd(), 'uploads', 'products');
    if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
    await writeFile(join(dest, filename), file.buffer);
    return `/uploads/products/${filename}`;
  }

  private async removeStoredFile(imageUrl: string): Promise<void> {
    const token = this.blobToken;

    if (token && imageUrl.includes('blob.vercel-storage.com')) {
      await del(imageUrl, { token });
      return;
    }

    if (imageUrl.startsWith('/uploads/products/')) {
      const filePath = join(process.cwd(), imageUrl.replace(/^\//, ''));
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
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
      const imageUrl = await this.storeFile(file, productId);

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

    await this.removeStoredFile(image.imageUrl);
    await this.imageRepo.softDelete(imageId);
    return { message: 'Image deleted' };
  }
}
