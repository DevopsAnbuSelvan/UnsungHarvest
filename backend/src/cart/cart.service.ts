import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, BuyerProfile } from '../database/entities';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(BuyerProfile)
    private buyerRepo: Repository<BuyerProfile>,
  ) {}

  private async getBuyerId(userId: string) {
    const buyer = await this.buyerRepo.findOne({ where: { userId } });
    if (!buyer) throw new NotFoundException('Buyer profile not found');
    return buyer.id;
  }

  async getCart(userId: string) {
    const buyerId = await this.getBuyerId(userId);
    return this.cartRepo.find({
      where: { buyerId },
      relations: ['product', 'product.images'],
      order: { createdAt: 'DESC' },
    });
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const buyerId = await this.getBuyerId(userId);
    const existing = await this.cartRepo.findOne({
      where: { buyerId, productId: dto.productId },
    });

    if (existing) {
      existing.quantity += dto.quantity;
      return this.cartRepo.save(existing);
    }

    const cartItem = this.cartRepo.create({
      buyerId,
      productId: dto.productId,
      quantity: dto.quantity,
    });
    return this.cartRepo.save(cartItem);
  }

  async updateItem(userId: string, dto: UpdateCartItemDto) {
    const buyerId = await this.getBuyerId(userId);
    const item = await this.cartRepo.findOne({
      where: { id: dto.id, buyerId },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    item.quantity = dto.quantity;
    return this.cartRepo.save(item);
  }

  async removeItem(userId: string, itemId: string) {
    const buyerId = await this.getBuyerId(userId);
    const item = await this.cartRepo.findOne({ where: { id: itemId, buyerId } });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.cartRepo.softDelete(itemId);
    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    const buyerId = await this.getBuyerId(userId);
    await this.cartRepo.softDelete({ buyerId });
    return { message: 'Cart cleared' };
  }
}
