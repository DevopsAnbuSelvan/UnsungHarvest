import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist, BuyerProfile } from '../database/entities';
import { AddToWishlistDto, ListWishlistDto } from './dto/wishlist.dto';
import { buildPaginatedResult } from '../common/utils/helpers';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepo: Repository<Wishlist>,
    @InjectRepository(BuyerProfile)
    private buyerRepo: Repository<BuyerProfile>,
  ) {}

  private async getBuyerId(userId: string) {
    const buyer = await this.buyerRepo.findOne({ where: { userId } });
    if (!buyer) throw new NotFoundException('Buyer profile not found');
    return buyer.id;
  }

  async list(userId: string, dto: ListWishlistDto) {
    const buyerId = await this.getBuyerId(userId);
    const { page = 1, limit = 10 } = dto;
    const [items, total] = await this.wishlistRepo.findAndCount({
      where: { buyerId },
      relations: ['product', 'product.images'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return buildPaginatedResult(items, total, page, limit);
  }

  async add(userId: string, dto: AddToWishlistDto) {
    const buyerId = await this.getBuyerId(userId);
    const existing = await this.wishlistRepo.findOne({
      where: { buyerId, productId: dto.productId },
    });
    if (existing) return existing;

    const item = this.wishlistRepo.create({
      buyerId,
      productId: dto.productId,
    });
    return this.wishlistRepo.save(item);
  }

  async remove(userId: string, itemId: string) {
    const buyerId = await this.getBuyerId(userId);
    const item = await this.wishlistRepo.findOne({
      where: { id: itemId, buyerId },
    });
    if (!item) throw new NotFoundException('Wishlist item not found');
    await this.wishlistRepo.softDelete(itemId);
    return { message: 'Removed from wishlist' };
  }
}
