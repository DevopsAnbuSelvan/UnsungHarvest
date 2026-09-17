import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farmer, SellerProfile } from '../database/entities';
import { UserRole, isStaffRole } from '../common/enums';
import { buildPaginatedResult } from '../common/utils/helpers';
import {
  CreateFarmerDto,
  ListFarmersDto,
  UpdateFarmerDto,
} from './dto/farmer.dto';

@Injectable()
export class FarmersService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepo: Repository<Farmer>,
    @InjectRepository(SellerProfile)
    private sellerRepo: Repository<SellerProfile>,
  ) {}

  private async resolveSellerId(
    userId: string,
    role: string,
    sellerIdFromDto?: string,
  ): Promise<string> {
    if (isStaffRole(role)) {
      if (!sellerIdFromDto) {
        throw new BadRequestException(
          'sellerId is required when admin creates a farmer',
        );
      }
      const seller = await this.sellerRepo.findOne({
        where: { id: sellerIdFromDto },
      });
      if (!seller) throw new NotFoundException('Seller not found');
      return seller.id;
    }

    const seller = await this.sellerRepo.findOne({ where: { userId } });
    if (!seller) throw new ForbiddenException('Seller profile required');
    return seller.id;
  }

  async create(userId: string, role: string, dto: CreateFarmerDto) {
    const sellerId = await this.resolveSellerId(userId, role, dto.sellerId);
    const farmer = this.farmerRepo.create({
      name: dto.name,
      phone: dto.phone,
      village: dto.village,
      district: dto.district,
      state: dto.state,
      farmSize: dto.farmSize,
      crops: dto.crops,
      bio: dto.bio,
      photoUrl: dto.photoUrl,
      sellerId,
      isActive: true,
    });
    return this.farmerRepo.save(farmer);
  }

  async list(userId: string, role: string, dto: ListFarmersDto) {
    const { page = 1, limit = 10, search, sellerId } = dto;
    const qb = this.farmerRepo
      .createQueryBuilder('farmer')
      .leftJoinAndSelect('farmer.seller', 'seller')
      .leftJoinAndSelect('seller.user', 'sellerUser');

    // Sellers only see farmers they added
    if (role === UserRole.SELLER) {
      const seller = await this.sellerRepo.findOne({ where: { userId } });
      if (!seller) throw new ForbiddenException('Seller profile required');
      qb.andWhere('farmer.sellerId = :ownSellerId', { ownSellerId: seller.id });
    } else if (sellerId) {
      // Admin can filter by seller
      qb.andWhere('farmer.sellerId = :sellerId', { sellerId });
    }

    if (search) {
      qb.andWhere(
        '(farmer.name ILIKE :search OR farmer.village ILIKE :search OR farmer.district ILIKE :search OR seller.businessName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.andWhere('farmer.isActive = true');
    qb.orderBy('farmer.name', 'ASC');
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    const farmer = await this.farmerRepo.findOne({
      where: { id },
      relations: ['seller', 'seller.user'],
    });
    if (!farmer) throw new NotFoundException('Farmer not found');
    return farmer;
  }

  async update(userId: string, role: string, dto: UpdateFarmerDto) {
    const farmer = await this.getById(dto.id);
    await this.assertCanManage(userId, role, farmer.sellerId);

    const { id, sellerId: _sellerId, ...data } = dto;
    await this.farmerRepo.update(id, data);
    return this.getById(id);
  }

  async remove(userId: string, role: string, id: string) {
    const farmer = await this.getById(id);
    await this.assertCanManage(userId, role, farmer.sellerId);
    await this.farmerRepo.softDelete(id);
    return { message: 'Farmer deleted' };
  }

  private async assertCanManage(
    userId: string,
    role: string,
    farmerSellerId: string,
  ) {
    if (isStaffRole(role)) return;
    const seller = await this.sellerRepo.findOne({ where: { userId } });
    if (!seller || seller.id !== farmerSellerId) {
      throw new ForbiddenException('Not authorized to manage this farmer');
    }
  }
}
