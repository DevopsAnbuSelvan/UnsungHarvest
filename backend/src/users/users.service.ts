import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { ListUsersDto, UpdateUserDto } from './dto/user.dto';
import { buildPaginatedResult } from '../common/utils/helpers';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async list(dto: ListUsersDto) {
    const result = await this.usersRepository.findPaginated(dto);
    return buildPaginatedResult(result.items, result.total, result.page, result.limit);
  }

  async getById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(dto: UpdateUserDto) {
    await this.getById(dto.id);
    const { id, ...data } = dto;
    await this.usersRepository.update(id, data);
    return this.getById(id);
  }

  async remove(id: string) {
    await this.getById(id);
    await this.usersRepository.softDelete(id);
    return { message: 'User deleted successfully' };
  }
}
