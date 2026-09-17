import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SellerProfile, User } from '../database/entities';
import { ApprovalStatus, UserRole, UserStatus } from '../common/enums';
import {
  AdminUpdateSellerDto,
  ApproveSellerDto,
  CreateSellerDto,
  ListSellersDto,
  UpdateSellerProfileDto,
} from './dto/seller.dto';
import { buildPaginatedResult } from '../common/utils/helpers';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(SellerProfile)
    private sellerRepo: Repository<SellerProfile>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private dataSource: DataSource,
    private firebaseAdmin: FirebaseAdminService,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.sellerRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException('Seller profile not found');
    return profile;
  }

  async getById(id: string) {
    const profile = await this.sellerRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException('Seller not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateSellerProfileDto) {
    const profile = await this.getProfile(userId);
    await this.sellerRepo.update(profile.id, dto);
    return this.getProfile(userId);
  }

  async list(dto: ListSellersDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = dto;
    const qb = this.sellerRepo
      .createQueryBuilder('seller')
      .leftJoinAndSelect('seller.user', 'user');

    if (search) {
      qb.andWhere(
        '(seller.businessName ILIKE :search OR user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (status) qb.andWhere('seller.status = :status', { status });

    const allowed = ['createdAt', 'businessName', 'status'];
    const field = allowed.includes(sortBy || '') ? sortBy : 'createdAt';
    qb.orderBy(`seller.${field}`, sortOrder);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return buildPaginatedResult(items, total, page, limit);
  }

  async create(dto: CreateSellerDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    let firebaseUser;
    try {
      firebaseUser = await this.firebaseAdmin.createUser({
        email: dto.email,
        password: dto.password,
        displayName: dto.name,
      });
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to create Firebase user';
      throw new ConflictException(message);
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        const user = manager.create(User, {
          firebaseUid: firebaseUser.uid,
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          role: UserRole.SELLER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
        });
        const savedUser = await manager.save(User, user);

        const seller = manager.create(SellerProfile, {
          userId: savedUser.id,
          businessName: dto.businessName,
          businessDescription: dto.businessDescription,
          status: ApprovalStatus.APPROVED,
          approvedAt: new Date(),
          commissionPercent: dto.commissionPercent ?? 5,
        });
        await manager.save(SellerProfile, seller);

        return manager.findOne(SellerProfile, {
          where: { id: seller.id },
          relations: ['user'],
        });
      });
    } catch (error) {
      await this.firebaseAdmin.deleteUser(firebaseUser.uid).catch(() => undefined);
      throw error;
    }
  }

  async adminUpdate(dto: AdminUpdateSellerDto) {
    const seller = await this.getById(dto.id);
    const {
      id,
      name,
      phone,
      businessName,
      businessDescription,
      gstNumber,
      licenseNumber,
      status,
      commissionPercent,
    } = dto;

    if (name !== undefined || phone !== undefined) {
      await this.userRepo.update(seller.userId, {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
      });
    }

    await this.sellerRepo.update(id, {
      ...(businessName !== undefined ? { businessName } : {}),
      ...(businessDescription !== undefined ? { businessDescription } : {}),
      ...(gstNumber !== undefined ? { gstNumber } : {}),
      ...(licenseNumber !== undefined ? { licenseNumber } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(commissionPercent !== undefined ? { commissionPercent } : {}),
    });

    return this.getById(id);
  }

  async remove(id: string) {
    const seller = await this.getById(id);
    const firebaseUid = seller.user?.firebaseUid;
    await this.userRepo.softDelete(seller.userId);
    if (firebaseUid) {
      await this.firebaseAdmin.deleteUser(firebaseUid).catch(() => undefined);
    }
    return { message: 'Seller deleted' };
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
    return this.sellerRepo.findOne({
      where: { id: dto.id },
      relations: ['user'],
    });
  }
}
