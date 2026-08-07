import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, SellerProfile } from '../database/entities';
import { GiStatus, ProductStatus } from '../common/enums';
import {
  CreateProductDto,
  UpdateProductDto,
  ListProductsDto,
  ApproveProductDto,
} from './dto/product.dto';
import { buildPaginatedResult } from '../common/utils/helpers';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(SellerProfile)
    private sellerRepo: Repository<SellerProfile>,
  ) {}

  async create(userId: string, dto: CreateProductDto) {
    const seller = await this.sellerRepo.findOne({ where: { userId } });
    if (!seller) throw new ForbiddenException('Seller profile required');

    const product = this.productRepo.create({
      ...dto,
      sellerId: seller.id,
      status: ProductStatus.PENDING,
    });
    return this.productRepo.save(product);
  }

  async list(dto: ListProductsDto) {
    const { page = 1, limit = 10, search, categoryId, sellerId, status, sortBy = 'createdAt', sortOrder = 'DESC' } = dto;
    const qb = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.season', 'season')
      .leftJoinAndSelect('product.cultivationLocation', 'cultivationLocation');

    if (search) {
      qb.andWhere('(product.name ILIKE :search OR product.localName ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    if (categoryId) qb.andWhere('product.categoryId = :categoryId', { categoryId });
    if (sellerId) qb.andWhere('product.sellerId = :sellerId', { sellerId });
    if (status) qb.andWhere('product.status = :status', { status });

    const allowedSort = ['name', 'price', 'stock', 'createdAt'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
    qb.orderBy(`product.${sortField}`, sortOrder);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'seller', 'images', 'nutrition', 'season', 'cultivationLocation'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(userId: string, dto: UpdateProductDto) {
    const product = await this.getById(dto.id);
    const seller = await this.sellerRepo.findOne({ where: { userId } });
    if (!seller || product.sellerId !== seller.id) {
      throw new ForbiddenException('Not authorized to update this product');
    }
    const { id, ...data } = dto;
    await this.productRepo.update(id, { ...data, status: ProductStatus.PENDING });
    return this.getById(id);
  }

  async remove(userId: string, id: string) {
    const product = await this.getById(id);
    const seller = await this.sellerRepo.findOne({ where: { userId } });
    if (!seller || product.sellerId !== seller.id) {
      throw new ForbiddenException('Not authorized to delete this product');
    }
    await this.productRepo.softDelete(id);
    return { message: 'Product deleted' };
  }

  async approve(id: string, adminId: string) {
    await this.getById(id);
    await this.productRepo.update(id, {
      status: ProductStatus.APPROVED,
      approvedBy: adminId,
      approvedAt: new Date(),
      rejectionReason: null as string | null,
    });
    return this.getById(id);
  }

  async reject(dto: ApproveProductDto) {
    await this.getById(dto.id);
    await this.productRepo.update(dto.id, {
      status: ProductStatus.REJECTED,
      rejectionReason: dto.rejectionReason,
    });
    return this.getById(dto.id);
  }

  async listSeasonal(limit = 12) {
    const currentMonth = new Date().getMonth() + 1;
    const qb = this.approvedProductsQuery();
    qb.andWhere('product.season_id IS NOT NULL')
      .andWhere(
        '(season.start_month IS NULL OR season.end_month IS NULL OR ' +
          '(season.start_month <= season.end_month AND season.start_month <= :month AND season.end_month >= :month) OR ' +
          '(season.start_month > season.end_month AND (season.start_month <= :month OR season.end_month >= :month)))',
        { month: currentMonth },
      )
      .andWhere('season.is_active = true')
      .orderBy('product.createdAt', 'DESC')
      .take(limit);

    return qb.getMany();
  }

  async listGiTagged(limit = 12) {
    const qb = this.approvedProductsQuery();
    qb.andWhere('product.gi_status = :giStatus', { giStatus: GiStatus.REGISTERED })
      .orderBy('product.createdAt', 'DESC')
      .take(limit);

    return qb.getMany();
  }

  async listFeatured(limit = 12) {
    const qb = this.approvedProductsQuery();
    qb.orderBy('product.stock', 'DESC')
      .addOrderBy('product.createdAt', 'DESC')
      .take(limit);

    return qb.getMany();
  }

  async listTrending(limit = 12) {
    const qb = this.approvedProductsQuery();
    qb.orderBy('product.stock', 'DESC')
      .addOrderBy('product.price', 'ASC')
      .take(limit);

    return qb.getMany();
  }

  async listRecent(limit = 12) {
    const qb = this.approvedProductsQuery();
    qb.orderBy('product.createdAt', 'DESC').take(limit);

    return qb.getMany();
  }

  private approvedProductsQuery() {
    return this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('seller.user', 'sellerUser')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.season', 'season')
      .leftJoinAndSelect('product.cultivationLocation', 'cultivationLocation')
      .leftJoinAndSelect('product.nutrition', 'nutrition')
      .where('product.status = :status', { status: ProductStatus.APPROVED })
      .andWhere('product.stock > 0');
  }
}
