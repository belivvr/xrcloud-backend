import { Injectable } from '@nestjs/common'
import { RoomDto } from '../rooms/dto'
import { ScenesService } from '../scenes/scenes.service'
import { TiersService } from '../tiers/tiers.service'
import { SubscriptionsRepository } from './subscriptions.repository'

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly subscriptionsRepository: SubscriptionsRepository,
        private readonly tiersService: TiersService,
        private readonly scenesService: ScenesService
    ) {}

    async createSubscription() {}

    async updateSubscription() {}

    async findSubscriptionByAdminId(adminId: string) {
        const subscription = await this.subscriptionsRepository.findByAdminId(adminId)

        return subscription
    }

    async validateRoomCreation(sceneId: string, countRooms: number, desiredRoomSize: number) {
        const project = await this.scenesService.getProjectBySceneId(sceneId)

        const subscription = await this.findSubscriptionByAdminId(project.adminId)

        const tierId = subscription ? subscription.tierId : undefined

        await this.tiersService.validateMaxRooms(countRooms, tierId)

        await this.tiersService.validateMaxRoomSize(desiredRoomSize, tierId)
    }

    async validateRoomUpdate(room: RoomDto, desiredRoomSize = 1) {
        const project = await this.scenesService.getProjectBySceneId(room.sceneId)

        const subscription = await this.findSubscriptionByAdminId(project.adminId)

        const tierId = subscription ? subscription.tierId : undefined

        await this.tiersService.validateMaxRoomSize(desiredRoomSize, tierId)
    }
}
