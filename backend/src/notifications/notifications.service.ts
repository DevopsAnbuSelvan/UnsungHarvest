import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../database/entities';
import { NotificationType } from '../common/enums';
import { ListNotificationsDto } from './dto/notification.dto';
import { buildPaginatedResult } from '../common/utils/helpers';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async list(userId: string, dto: ListNotificationsDto) {
    const { page = 1, limit = 10, isRead } = dto;
    const where: Record<string, unknown> = { userId };
    if (isRead !== undefined) where.isRead = isRead;

    const [items, total] = await this.notificationRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return buildPaginatedResult(items, total, page, limit);
  }

  async markAsRead(userId: string, id: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id, userId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    await this.notificationRepo.update(id, { isRead: true, readAt: new Date() });
    return this.notificationRepo.findOne({ where: { id } });
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepo.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
    return { message: 'All notifications marked as read' };
  }

  async create(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.SYSTEM,
    metadata?: Record<string, unknown>,
  ) {
    const notification = this.notificationRepo.create({
      userId,
      title,
      message,
      type,
      metadata,
    });
    return this.notificationRepo.save(notification);
  }
}
