import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CreateNotificationDto } from 'src/services/notifications/dto'
import { NotificationsService } from 'src/services/notifications/notifications.service'
import { HeaderAuthGuard } from './guards'

@Controller('notifications')
@UseGuards(HeaderAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post()
    async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
        if (createNotificationDto.sceneId && createNotificationDto.roomId) {
            throw new BadRequestException('Either sceneId or roomId must be provided')
        }

        await this.notificationsService.createNotification(createNotificationDto)
    }
}
