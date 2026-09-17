import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import {
  ListNotificationsDto,
  NotificationIdDto,
  MarkAllReadDto,
} from './dto/notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('notifications_list_api')
  @ApiOperation({ summary: 'List user notifications' })
  list(
    @CurrentUser('sub') userId: string,
    @Body() dto: ListNotificationsDto,
  ) {
    return this.notificationsService.list(userId, dto);
  }

  @Post('notifications_mark_read_api')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(
    @CurrentUser('sub') userId: string,
    @Body() dto: NotificationIdDto,
  ) {
    return this.notificationsService.markAsRead(userId, dto.id);
  }

  @Post('notifications_mark_all_read_api')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@CurrentUser('sub') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }
}
