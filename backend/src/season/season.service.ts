import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Season } from '../database/entities';
import { CreateSeasonDto, UpdateSeasonDto, ListSeasonsDto } from './dto/season.dto';
import { buildPaginatedResult } from '../common/utils/helpers';

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(Season)
    private seasonRepo: Repository<Season>,
  ) {}

  create(dto: CreateSeasonDto) {
    return this.seasonRepo.save(this.seasonRepo.create(dto));
  }

  async list(dto: ListSeasonsDto) {
    const { page = 1, limit = 10, search } = dto;
    const qb = this.seasonRepo.createQueryBuilder('season');
    if (search) qb.andWhere('season.name ILIKE :search', { search: `%${search}%` });
    qb.orderBy('season.name', 'ASC');
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    const season = await this.seasonRepo.findOne({ where: { id } });
    if (!season) throw new NotFoundException('Season not found');
    return season;
  }

  async update(dto: UpdateSeasonDto) {
    await this.getById(dto.id);
    const { id, ...data } = dto;
    await this.seasonRepo.update(id, data);
    return this.getById(id);
  }

  async remove(id: string) {
    await this.getById(id);
    await this.seasonRepo.softDelete(id);
    return { message: 'Season deleted' };
  }
}
