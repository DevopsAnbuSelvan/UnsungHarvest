import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User, AdminProfile } from '../database/entities';
import { UserRole, UserStatus } from '../common/enums';
import {
  CreateAdminDto,
  ListAdminsDto,
  UpdateAdminDto,
} from './dto/admin.dto';
import { buildPaginatedResult } from '../common/utils/helpers';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';

/** Manages users with role = admin (Super Cold Admin only) */
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(AdminProfile)
    private adminRepo: Repository<AdminProfile>,
    private dataSource: DataSource,
    private firebaseAdmin: FirebaseAdminService,
  ) {}

  async create(dto: CreateAdminDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
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
        return this.persistAdmin(manager, firebaseUser.uid, dto);
      });
    } catch (error) {
      await this.firebaseAdmin.deleteUser(firebaseUser.uid).catch(() => undefined);
      throw error;
    }
  }

  private async persistAdmin(
    manager: EntityManager,
    firebaseUid: string,
    dto: CreateAdminDto,
  ): Promise<User> {
    const user = manager.create(User, {
      firebaseUid,
      name: dto.name,
      email: dto.email,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    });
    const savedUser = await manager.save(User, user);

    await manager.save(
      AdminProfile,
      manager.create(AdminProfile, {
        userId: savedUser.id,
        department: dto.department,
        permissions: dto.permissions || [],
      }),
    );

    const full = await manager.findOne(User, {
      where: { id: savedUser.id },
      relations: ['adminProfile'],
    });
    return full as User;
  }

  async list(dto: ListAdminsDto) {
    const { page = 1, limit = 10 } = dto;
    const [items, total] = await this.userRepo.findAndCount({
      where: { role: UserRole.ADMIN },
      relations: ['adminProfile'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    const user = await this.userRepo.findOne({
      where: { id, role: UserRole.ADMIN },
      relations: ['adminProfile'],
    });
    if (!user) throw new NotFoundException('Admin not found');
    return user;
  }

  async update(dto: UpdateAdminDto) {
    const user = await this.getById(dto.id);
    const { id, name, phone, department, permissions, status } = dto;

    await this.userRepo.update(id, {
      ...(name !== undefined ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(status !== undefined ? { status: status as UserStatus } : {}),
    });

    if (
      user.adminProfile &&
      (department !== undefined || permissions !== undefined)
    ) {
      await this.adminRepo.update(user.adminProfile.id, {
        ...(department !== undefined ? { department } : {}),
        ...(permissions !== undefined ? { permissions } : {}),
      });
    }

    return this.getById(id);
  }

  async remove(id: string) {
    const user = await this.getById(id);
    const firebaseUid = user.firebaseUid;
    await this.userRepo.softDelete(id);
    if (firebaseUid) {
      await this.firebaseAdmin.deleteUser(firebaseUid).catch(() => undefined);
    }
    return { message: 'Admin deleted' };
  }
}
