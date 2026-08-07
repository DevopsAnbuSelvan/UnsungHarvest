import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuyerProfile, Address } from '../database/entities';
import { UpdateBuyerProfileDto, CreateAddressDto } from './dto/buyer.dto';
import { buildPaginatedResult } from '../common/utils/helpers';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class BuyersService {
  constructor(
    @InjectRepository(BuyerProfile)
    private buyerRepo: Repository<BuyerProfile>,
    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.buyerRepo.findOne({
      where: { userId },
      relations: ['user', 'addresses'],
    });
    if (!profile) throw new NotFoundException('Buyer profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateBuyerProfileDto) {
    const profile = await this.getProfile(userId);
    await this.buyerRepo.update(profile.id, dto);
    return this.getProfile(userId);
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    const profile = await this.getProfile(userId);
    const address = this.addressRepo.create({ ...dto, buyerId: profile.id });
    return this.addressRepo.save(address);
  }

  async listAddresses(userId: string, dto: PaginationDto) {
    const profile = await this.getProfile(userId);
    const { page = 1, limit = 10 } = dto;
    const [items, total] = await this.addressRepo.findAndCount({
      where: { buyerId: profile.id },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return buildPaginatedResult(items, total, page, limit);
  }

  async deleteAddress(userId: string, addressId: string) {
    const profile = await this.getProfile(userId);
    const address = await this.addressRepo.findOne({
      where: { id: addressId, buyerId: profile.id },
    });
    if (!address) throw new NotFoundException('Address not found');
    await this.addressRepo.softDelete(addressId);
    return { message: 'Address deleted' };
  }
}
