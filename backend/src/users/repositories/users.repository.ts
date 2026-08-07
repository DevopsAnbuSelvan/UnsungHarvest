import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities';
import { ListUsersDto } from '../dto/user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findPaginated(dto: ListUsersDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC', role, status } = dto;
    const qb = this.repository.createQueryBuilder('user');

    if (search) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    if (role) qb.andWhere('user.role = :role', { role });
    if (status) qb.andWhere('user.status = :status', { status });

    const allowedSort = ['name', 'email', 'createdAt', 'role', 'status'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';

    qb.orderBy(`user.${sortField}`, sortOrder);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  findById(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: ['buyerProfile', 'sellerProfile', 'adminProfile'],
    });
  }

  update(id: string, data: Partial<User>) {
    return this.repository.update(id, data);
  }

  softDelete(id: string) {
    return this.repository.softDelete(id);
  }
}
