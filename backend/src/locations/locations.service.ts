import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CultivationLocation } from '../database/entities';
import { CreateLocationDto, UpdateLocationDto, ListLocationsDto } from './dto/location.dto';
import { buildPaginatedResult } from '../common/utils/helpers';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(CultivationLocation)
    private locationRepo: Repository<CultivationLocation>,
  ) {}

  create(dto: CreateLocationDto) {
    return this.locationRepo.save(this.locationRepo.create(dto));
  }

  async list(dto: ListLocationsDto) {
    const { page = 1, limit = 10, search } = dto;
    const qb = this.locationRepo.createQueryBuilder('location');
    if (search) {
      qb.andWhere(
        '(location.name ILIKE :search OR location.region ILIKE :search OR location.state ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    qb.orderBy('location.name', 'ASC');
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    const location = await this.locationRepo.findOne({ where: { id } });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  async update(dto: UpdateLocationDto) {
    await this.getById(dto.id);
    const { id, ...data } = dto;
    await this.locationRepo.update(id, data);
    return this.getById(id);
  }

  async remove(id: string) {
    await this.getById(id);
    await this.locationRepo.softDelete(id);
    return { message: 'Location deleted' };
  }
}
