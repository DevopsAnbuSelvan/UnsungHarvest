import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Address, BuyerProfile, User } from '../database/entities';
import { UserRole, UserStatus } from '../common/enums';
import {
  AdminUpdateBuyerDto,
  CreateAddressDto,
  CreateBuyerDto,
  ListBuyersDto,
  UpdateBuyerProfileDto,
} from './dto/buyer.dto';
import { buildPaginatedResult } from '../common/utils/helpers';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';

@Injectable()
export class BuyersService {
  constructor(
    @InjectRepository(BuyerProfile)
    private buyerRepo: Repository<BuyerProfile>,
    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private dataSource: DataSource,
    private firebaseAdmin: FirebaseAdminService,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.buyerRepo.findOne({
      where: { userId },
      relations: ['user', 'addresses'],
    });
    if (!profile) throw new NotFoundException('Buyer profile not found');
    return profile;
  }

  async getByUserId(userId: string) {
    return this.getProfile(userId);
  }

  async updateProfile(userId: string, dto: UpdateBuyerProfileDto) {
    const profile = await this.getProfile(userId);
    await this.buyerRepo.update(profile.id, dto);
    return this.getProfile(userId);
  }

  async list(dto: ListBuyersDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = dto;
    const qb = this.buyerRepo
      .createQueryBuilder('buyer')
      .leftJoinAndSelect('buyer.user', 'user');

    if (search) {
      qb.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const allowed = ['createdAt'];
    const field = allowed.includes(sortBy || '') ? sortBy : 'createdAt';
    qb.orderBy(`buyer.${field}`, sortOrder);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return buildPaginatedResult(items, total, page, limit);
  }

  async create(dto: CreateBuyerDto) {
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
          role: UserRole.BUYER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
        });
        const savedUser = await manager.save(User, user);

        const buyer = manager.create(BuyerProfile, {
          userId: savedUser.id,
          bio: dto.bio,
        });
        await manager.save(BuyerProfile, buyer);

        return manager.findOne(BuyerProfile, {
          where: { id: buyer.id },
          relations: ['user'],
        });
      });
    } catch (error) {
      await this.firebaseAdmin.deleteUser(firebaseUser.uid).catch(() => undefined);
      throw error;
    }
  }

  async adminUpdate(dto: AdminUpdateBuyerDto) {
    const profile = await this.getProfile(dto.id);
    const { id, name, phone, bio, status } = dto;

    if (name !== undefined || phone !== undefined || status !== undefined) {
      await this.userRepo.update(id, {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(status !== undefined ? { status: status as UserStatus } : {}),
      });
    }

    if (bio !== undefined) {
      await this.buyerRepo.update(profile.id, { bio });
    }

    return this.getProfile(id);
  }

  async remove(userId: string) {
    const profile = await this.getProfile(userId);
    const firebaseUid = profile.user?.firebaseUid;
    await this.userRepo.softDelete(userId);
    if (firebaseUid) {
      await this.firebaseAdmin.deleteUser(firebaseUid).catch(() => undefined);
    }
    return { message: 'Buyer deleted' };
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
