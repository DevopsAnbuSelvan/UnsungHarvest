import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerProfile } from '../database/entities';
import { ApprovalStatus } from '../common/enums';
import { ListSellersDto, UpdateSellerProfileDto, ApproveSellerDto } from './dto/seller.dto';
import { buildPaginatedResult } from '../common/utils/helpers';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(SellerProfile)
    private sellerRepo: Repository<SellerProfile>,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.sellerRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException('Seller profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateSellerProfileDto) {
    const profile = await this.getProfile(userId);
    await this.sellerRepo.update(profile.id, dto);
    return this.getProfile(userId);
  }

  async list(dto: ListSellersDto) {
    const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'DESC' } = dto;
    const qb = this.sellerRepo.createQueryBuilder('seller')
      .leftJoinAndSelect('seller.user', 'user');

    if (search) {
      qb.andWhere('(seller.businessName ILIKE :search OR user.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    if (status) qb.andWhere('seller.status = :status', { status });

    qb.orderBy(`seller.${sortBy}`, sortOrder);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return buildPaginatedResult(items, total, page, limit);
  }

  async approve(id: string, adminId: string) {
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException('Seller not found');
    await this.sellerRepo.update(id, {
      status: ApprovalStatus.APPROVED,
      approvedBy: adminId,
      approvedAt: new Date(),
      rejectionReason: null as string | null,
    });
    return this.sellerRepo.findOne({ where: { id }, relations: ['user'] });
  }

  async reject(dto: ApproveSellerDto) {
    const seller = await this.sellerRepo.findOne({ where: { id: dto.id } });
    if (!seller) throw new NotFoundException('Seller not found');
    await this.sellerRepo.update(dto.id, {
      status: ApprovalStatus.REJECTED,
      rejectionReason: dto.rejectionReason,
    });
    return this.sellerRepo.findOne({ where: { id: dto.id }, relations: ['user'] });
  }
}
