import { Injectable } from '@nestjs/common'
import { ReticulumService } from 'src/infra/reticulum/reticulum.service'
import { RoomsService } from '../rooms/rooms.service'
import { ScenesService } from '../scenes/scenes.service'
import { CreateNotificationDto } from './dto'

@Injectable()
export class NotificationsService {
    constructor(
        private readonly reticulumService: ReticulumService,
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService
    ) {}

    async createNotification(createNotificationDto: CreateNotificationDto) {
        const { sceneId, roomId, ...restDto } = createNotificationDto

        const notificationData = {
            ...restDto
        }

        if (sceneId && !roomId) {
            const scene = await this.scenesService.getScene(sceneId)

            await this.reticulumService.createNoticeForScene(notificationData, scene.infraSceneId)
        } else if (!sceneId && roomId) {
            const room = await this.roomsService.getRoom(roomId)

            await this.reticulumService.createNoticeForRoom(notificationData, room.infraRoomId)
        } else {
            await this.reticulumService.createNoticeForAll(notificationData)
        }
    }
}
