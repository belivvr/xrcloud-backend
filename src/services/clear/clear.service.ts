import { Injectable } from '@nestjs/common'
import { TransactionException } from 'src/common'
import { AdminsService } from 'src/services/admins/admins.service'
import { ProjectsService } from 'src/services/projects/projects.service'
import { RoomsService } from 'src/services/rooms/rooms.service'
import { ScenesService } from 'src/services/scenes/scenes.service'

@Injectable()
export class ClearService {
    constructor(
        private readonly adminsService: AdminsService,
        private readonly projectsService: ProjectsService,
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService
    ) {}

    async clearAdmin(adminId: string) {
        await this.adminsService.validateAdminExists(adminId)

        try {
            await this._clearProjects(adminId)

            await this.adminsService.removeAdmin(adminId)
        } catch (error) {
            throw new TransactionException(`Admin with ID "${adminId}" clear failed: ${error.message}`)
        }
    }

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

    async _clearProjects(adminId: string) {
        const projects = await this.projectsService.findProjectsByAdminId(adminId)

        for (const project of projects) {
            await this.clearProject(project.id)
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
