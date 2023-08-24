import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { RoomsService } from 'src/rooms'
import { ScenesService } from 'src/scenes'
import { ProjectsService } from '../projects.service'

@Injectable()
export class ValidationService {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService
    ) {}

    async validateProject(projectId: string) {
        const projectExists = await this.projectsService.projectExists(projectId)

        if (!projectExists) {
            throw new NotFoundException(`Project with ID "${projectId}" not found.`)
        }
    }

    async validateScene(projectId: string, sceneId: string) {
        await this.validateProject(projectId)

        const sceneExists = await this.scenesService.sceneExists(sceneId)

        if (!sceneExists) {
            throw new NotFoundException(`Scene with ID "${sceneId}" not found.`)
        }

        const scene = await this.scenesService.getScene(sceneId)

        if (scene.projectId !== projectId) {
            throw new BadRequestException(`Project with ID "${projectId}" is invalid.`)
        }
    }

    async validateRoom(projectId: string, sceneId: string, roomId: string) {
        await this.validateProject(projectId)
        await this.validateScene(projectId, sceneId)

        const roomExists = await this.roomsService.roomExists(roomId)

        if (!roomExists) {
            throw new NotFoundException(`Room with ID "${roomId}" not found.`)
        }

        const room = await this.roomsService.getRoom(roomId)

        if (room.projectId !== projectId) {
            throw new BadRequestException(`Project with ID "${projectId}" is invalid.`)
        }

        if (room.sceneId !== sceneId) {
            throw new BadRequestException(`Scene with ID "${sceneId}" is invalid.`)
        }
    }
}
