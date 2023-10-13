import { Injectable } from '@nestjs/common'
import { ProjectsService } from '../projects/projects.service'
import { RoomDto } from '../rooms/dto'
import { ScenesService } from '../scenes/scenes.service'
import { TiersService } from '../tiers/tiers.service'
import { SubscriptionsRepository } from './subscriptions.repository'
import { SubscriptionStatus } from './types'

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly subscriptionsRepository: SubscriptionsRepository,
        private readonly tiersService: TiersService,
        private readonly projectsService: ProjectsService,
        private readonly scenesService: ScenesService
    ) {}

    async createSubscription(adminId: string, tierId?: string) {
        if (!tierId) {
            tierId = (await this.tiersService.getDefaultTier()).id
        }

        const startAt = new Date()
        const endAt = new Date(startAt)
        endAt.setFullYear(endAt.getFullYear() + 1)

        const createSubscription = {
            status: SubscriptionStatus.active,
            startAt,
            endAt,
            adminId,
            tierId
        }

        await this.subscriptionsRepository.create(createSubscription)
    }

    async updateSubscription() {}

    async findSubscriptionByAdminId(adminId: string) {
        const subscription = await this.subscriptionsRepository.findByAdminId(adminId)

        return subscription
    }

    async validateRoomCreation(sceneId: string, roomCount: number, desiredRoomSize: number) {
        const scene = await this.scenesService.getScene(sceneId)

        const project = await this.projectsService.getProject(scene.projectId)

        const subscription = await this.findSubscriptionByAdminId(project.adminId)

        const tierId = subscription ? subscription.tierId : undefined

        await this.tiersService.validateMaxRooms(roomCount, tierId)

        await this.tiersService.validateMaxRoomSize(desiredRoomSize, tierId)
    }

    async validateRoomUpdate(room: RoomDto, desiredRoomSize = 1) {
        const scene = await this.scenesService.getScene(room.sceneId)

        const project = await this.projectsService.getProject(scene.projectId)

        const subscription = await this.findSubscriptionByAdminId(project.adminId)

        const tierId = subscription ? subscription.tierId : undefined

        await this.tiersService.validateMaxRoomSize(desiredRoomSize, tierId)
    }
}
