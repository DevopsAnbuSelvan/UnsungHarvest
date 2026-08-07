import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionInformation } from '../database/entities';
import { CreateNutritionDto, UpdateNutritionDto, ListNutritionDto } from './dto/nutrition.dto';
import { buildPaginatedResult } from '../common/utils/helpers';

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(NutritionInformation)
    private nutritionRepo: Repository<NutritionInformation>,
  ) {}

  create(dto: CreateNutritionDto) {
    return this.nutritionRepo.save(this.nutritionRepo.create(dto));
  }

  async list(dto: ListNutritionDto) {
    const { page = 1, limit = 10 } = dto;
    const [items, total] = await this.nutritionRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    const nutrition = await this.nutritionRepo.findOne({ where: { id } });
    if (!nutrition) throw new NotFoundException('Nutrition info not found');
    return nutrition;
  }

  async update(dto: UpdateNutritionDto) {
    await this.getById(dto.id);
    const { id, ...data } = dto;
    await this.nutritionRepo.update(id, data);
    return this.getById(id);
  }

  async remove(id: string) {
    await this.getById(id);
    await this.nutritionRepo.softDelete(id);
    return { message: 'Nutrition info deleted' };
  }
}
