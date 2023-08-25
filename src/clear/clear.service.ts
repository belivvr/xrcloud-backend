import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { TransactionException } from 'src/common'
import { ProjectsService } from 'src/projects/projects.service'
import { RoomsService } from 'src/rooms/rooms.service'
import { ScenesService } from 'src/scenes/scenes.service'

@Injectable()
export class ClearService {
    constructor(
        @Inject(forwardRef(() => ProjectsService))
        private readonly projectsService: ProjectsService,
        @Inject(forwardRef(() => ScenesService))
        private readonly scenesService: ScenesService,
        @Inject(forwardRef(() => RoomsService))
        private readonly roomsService: RoomsService
    ) {}

    async clearProject(projectId: string) {
        await this.projectsService.validateProjectExists(projectId)

        try {
            await this._clearScenes(projectId)

            await this.projectsService.removeProject(projectId)
        } catch (error) {
            throw new TransactionException(`Project with ID "${projectId}" clear failed: ${error.message}`)
        }
    }

    async clearScene(sceneId: string) {
        await this.scenesService.validateSceneExists(sceneId)

        try {
            await this._clearRooms(sceneId)

            await this.scenesService.removeScene(sceneId)
        } catch (error) {
            throw new TransactionException(`Scene with ID "${sceneId}" clear failed: ${error.message}`)
        }
    }

    async clearRoom(roomId: string) {
        await this.roomsService.validateRoomExists(roomId)

        try {
            await this.roomsService.removeRoom(roomId)
        } catch (error) {
            throw new TransactionException(`Room with ID "${roomId}" clear failed: ${error.message}`)
        }
    }

    private async _clearScenes(projectId: string) {
        const scenes = await this.scenesService.findScenesByProjectId(projectId)

        for (const scene of scenes) {
            await this.clearScene(scene.id)
        }
    }

    private async _clearRooms(sceneId: string) {
        const rooms = await this.roomsService.findRoomsBySceneId(sceneId)

        for (const room of rooms) {
            await this.clearRoom(room.id)
        }
    }
}
