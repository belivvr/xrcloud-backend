import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiKeyAuthGuard } from 'src/auth'
import { ReticulumService } from 'src/reticulum'
import { RoomsService } from 'src/rooms'
import { ScenesService } from 'src/scenes'
import { CreateRoomDto, QueryDto, UpdateRoomDto } from './dto'
import { GetRoomQueryDto } from './dto/rooms/get-room-query.dto'
import { ProjectsService } from './projects.service'
import { ProjectConfigService, ValidationService } from './services'

@Controller('api/projects')
@UseGuards(ApiKeyAuthGuard)
export class ApiProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly configService: ProjectConfigService,
        private readonly validationService: ValidationService,
        private readonly reticulumService: ReticulumService,
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService
    ) {}

    /**
     * Projects
     */
    @Get(':projectId')
    async getProject(@Param('projectId') projectId: string) {
        await this.validationService.validateProject(projectId)

        return await this.projectsService.getProjectDto(projectId)
    }

    /**
     * Scenes
     */
    @Get(':projectId/scenes')
    async findScenes(@Param('projectId') projectId: string, @Query() queryDto: QueryDto) {
        await this.validationService.validateProject(projectId)

        const scenes = await this.scenesService.findScenes(projectId, queryDto)

        if (scenes.items.length === 0) {
            return { ...scenes, items: [] }
        }

        const dtos = await Promise.all(scenes.items.map((scene) => this.scenesService.getSceneDto(scene.id)))

        return { ...scenes, items: dtos }
    }

    @Get(':projectId/scenes/:sceneId')
    async getScene(@Param('projectId') projectId: string, @Param('sceneId') sceneId: string) {
        await this.validationService.validateScene(projectId, sceneId)

        return await this.scenesService.getSceneDto(sceneId)
    }

    @Delete(':projectId/scenes/:sceneId')
    async removeScene(@Param('projectId') projectId: string, @Param('sceneId') sceneId: string) {
        await this.validationService.validateScene(projectId, sceneId)

        return await this.scenesService.removeScene(sceneId)
    }

    /**
     * Rooms
     */
    @Post(':projectId/scenes/:sceneId/rooms')
    async createRoom(
        @Param('projectId') projectId: string,
        @Param('sceneId') sceneId: string,
        @Body() createRoomDto: CreateRoomDto
    ) {
        await this.validationService.validateScene(projectId, sceneId)

        const createRoom = {
            projectId: projectId,
            sceneId: sceneId,
            ...createRoomDto
        }

        const room = await this.roomsService.createRoom(createRoom)

        const token = await this.reticulumService.getToken(
            projectId,
            this.configService.userAccessTokenExpiration
        )

        return await this.roomsService.getRoomDto(room.id, token)
    }

    @Get(':projectId/scenes/:sceneId/rooms')
    async findRooms(
        @Param('projectId') projectId: string,
        @Param('sceneId') sceneId: string,
        @Query() getRoomQueryDto: GetRoomQueryDto
    ) {
        await this.validationService.validateScene(projectId, sceneId)

        const rooms = await this.roomsService.findRooms({ sceneId, ...getRoomQueryDto })

        if (rooms.items.length === 0) {
            return { ...rooms, items: [] }
        }

        const token = await this.reticulumService.getToken(
            projectId,
            this.configService.userAccessTokenExpiration,
            getRoomQueryDto.userId
        )

        const dtos = await Promise.all(
            rooms.items.map((room) => this.roomsService.getRoomDto(room.id, token))
        )

        return { ...rooms, items: dtos }
    }

    @Get(':projectId/scenes/:sceneId/rooms/:roomId')
    async getRoom(
        @Param('projectId') projectId: string,
        @Param('sceneId') sceneId: string,
        @Param('roomId') roomId: string,
        @Query() getRoomQueryDto: GetRoomQueryDto
    ) {
        await this.validationService.validateRoom(projectId, sceneId, roomId)

        const token = await this.reticulumService.getToken(
            projectId,
            this.configService.userAccessTokenExpiration,
            getRoomQueryDto.userId
        )

        return await this.roomsService.getRoomDto(roomId, token)
    }

    @Patch(':projectId/scenes/:sceneId/rooms/:roomId')
    async updateRoom(
        @Param('projectId') projectId: string,
        @Param('sceneId') sceneId: string,
        @Param('roomId') roomId: string,
        @Body() updateRoomDto: UpdateRoomDto
    ) {
        await this.validationService.validateRoom(projectId, sceneId, roomId)

        const updateRoom = {
            roomId: roomId,
            ...updateRoomDto
        }

        const room = await this.roomsService.updateRoom(updateRoom)

        const token = await this.reticulumService.getToken(
            projectId,
            this.configService.userAccessTokenExpiration
        )

        return await this.roomsService.getRoomDto(room.id, token)
    }

    @Delete(':projectId/scenes/:sceneId/rooms/:roomId')
    async removeRoom(
        @Param('projectId') projectId: string,
        @Param('sceneId') sceneId: string,
        @Param('roomId') roomId: string
    ) {
        await this.validationService.validateRoom(projectId, sceneId, roomId)

        return await this.roomsService.removeRoom(roomId)
    }
}
