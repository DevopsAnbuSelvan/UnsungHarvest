import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../database/entities';
import { CreateCategoryDto, UpdateCategoryDto, ListCategoriesDto } from './dto/category.dto';
import { buildPaginatedResult, slugify } from '../common/utils/helpers';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepo.create({
      ...dto,
      slug: slugify(dto.name),
    });
    return this.categoryRepo.save(category);
  }

  async list(dto: ListCategoriesDto) {
    const { page = 1, limit = 10, search, isActive } = dto;
    const qb = this.categoryRepo.createQueryBuilder('category');

    if (search) {
      qb.andWhere('category.name ILIKE :search', { search: `%${search}%` });
    }
    if (isActive !== undefined) {
      qb.andWhere('category.isActive = :isActive', { isActive });
    }

    qb.orderBy('category.name', 'ASC');
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(dto: UpdateCategoryDto) {
    await this.getById(dto.id);
    const { id, name, ...rest } = dto;
    const updateData: Partial<Category> = { ...rest };
    if (name) updateData.name = name;
    if (name) updateData.slug = slugify(name);
    await this.categoryRepo.update(id, updateData);
    return this.getById(id);
  }

  async remove(id: string) {
    await this.getById(id);
    await this.categoryRepo.softDelete(id);
    return { message: 'Category deleted' };
  }
}
