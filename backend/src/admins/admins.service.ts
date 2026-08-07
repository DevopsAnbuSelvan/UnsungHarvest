import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, AdminProfile } from '../database/entities';
import { UserRole, UserStatus } from '../common/enums';
import { CreateAdminDto, ListAdminsDto } from './dto/admin.dto';
import { buildPaginatedResult } from '../common/utils/helpers';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(AdminProfile)
    private adminRepo: Repository<AdminProfile>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateAdminDto) {
    return this.dataSource.transaction(async (manager) => {
      const hashedPassword = await bcrypt.hash(dto.password, 12);
      const user = manager.create(User, {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: UserRole.SUPER_COLD_ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      });
      const savedUser = await manager.save(User, user);

      const adminProfile = manager.create(AdminProfile, {
        userId: savedUser.id,
        department: dto.department,
        permissions: dto.permissions || [],
      });
      await manager.save(AdminProfile, adminProfile);

      return manager.findOne(User, {
        where: { id: savedUser.id },
        relations: ['adminProfile'],
      });
    });
  }

  async list(dto: ListAdminsDto) {
    const { page = 1, limit = 10 } = dto;
    const [items, total] = await this.userRepo.findAndCount({
      where: { role: UserRole.SUPER_COLD_ADMIN },
      relations: ['adminProfile'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    const user = await this.userRepo.findOne({
      where: { id, role: UserRole.SUPER_COLD_ADMIN },
      relations: ['adminProfile'],
    });
    if (!user) throw new NotFoundException('Admin not found');
    return user;
  }
}
