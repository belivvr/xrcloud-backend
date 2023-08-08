import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    UseGuards
} from '@nestjs/common'
import { ApiKeyAuthGuard } from 'src/auth'
import { RoomsService } from 'src/rooms'
import { ScenesService } from 'src/scenes'
import { UserDto, UsersService } from 'src/users'
import { CreateRoomDto, CreateUserDto, QueryDto, UpdateRoomDto } from './dto'
import { ProjectsService } from './projects.service'

@Controller('api/projects')
@UseGuards(ApiKeyAuthGuard)
export class ApiProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly usersService: UsersService,
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService
    ) {}

    /**
     * Projects
     */
    @Get(':projectId')
    async getProject(@Param('projectId') projectId: string) {
        await this.validateProject(projectId)

        return await this.projectsService.getProjectDto(projectId)
    }

    /**
     * Users
     */
    @Post(':projectId/users')
    async createUser(@Param('projectId') projectId: string, @Body() createUserDto: CreateUserDto) {
        await this.validateProject(projectId)

        const { personalId } = createUserDto

        const createUser = {
            personalId: personalId,
            projectId: projectId
        }

        const user = await this.usersService.createUser(createUser)

        return new UserDto(user)
    }

    /**
     * Scenes
     */
    @Get(':projectId/scenes')
    async findScenes(@Param('projectId') projectId: string, @Query() queryDto: QueryDto) {
        await this.validateProject(projectId)

        const scenes = await this.scenesService.findScenes(projectId, queryDto)

        const items = await Promise.all(scenes.items.map((scene) => this.scenesService.getSceneDto(scene.id)))

        return { ...scenes, items }
    }

    @Get(':projectId/scenes/:sceneId')
    async getScene(@Param('projectId') projectId: string, @Param('sceneId') sceneId: string) {
        await this.validateProject(projectId)
        await this.validateScene(projectId, sceneId)

        return await this.scenesService.getSceneDto(sceneId)
    }

    @Delete(':projectId/scenes/:sceneId')
    async removeScene(@Param('projectId') projectId: string, @Param('sceneId') sceneId: string) {
        await this.validateProject(projectId)
        await this.validateScene(projectId, sceneId)

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
        await this.validateProject(projectId)
        await this.validateScene(projectId, sceneId)

        const createRoom = {
            projectId: projectId,
            sceneId: sceneId,
            ...createRoomDto
        }

        const room = await this.roomsService.createRoom(createRoom)

        return await this.roomsService.getRoomDto(room.id)
    }

    @Get(':projectId/scenes/:sceneId/rooms')
    async findRooms(
        @Param('projectId') projectId: string,
        @Param('sceneId') sceneId: string,
        @Query() queryDto: QueryDto
    ) {
        await this.validateProject(projectId)
        await this.validateScene(projectId, sceneId)

        const rooms = await this.roomsService.findRooms({ sceneId, ...queryDto })

        const items = await Promise.all(rooms.items.map((room) => this.roomsService.getRoomDto(room.id)))

        return { ...rooms, items }
    }

    @Get(':projectId/scenes/:sceneId/rooms/:roomId')
    async getRoom(
        @Param('projectId') projectId: string,
        @Param('sceneId') sceneId: string,
        @Param('roomId') roomId: string
    ) {
        await this.validateProject(projectId)
        await this.validateScene(projectId, sceneId)
        await this.validateRoom(projectId, sceneId, roomId)

        return await this.roomsService.getRoomDto(roomId)
    }

    @Patch(':projectId/scenes/:sceneId/rooms/:roomId')
    async updateRoom(
        @Param('projectId') projectId: string,
        @Param('sceneId') sceneId: string,
        @Param('roomId') roomId: string,
        @Body() updateRoomDto: UpdateRoomDto
    ) {
        await this.validateProject(projectId)
        await this.validateScene(projectId, sceneId)
        await this.validateRoom(projectId, sceneId, roomId)

        const updateRoom = {
            projectId: projectId,
            roomId: roomId,
            ...updateRoomDto
        }

        const room = await this.roomsService.updateRoom(updateRoom)

        return await this.roomsService.getRoomDto(room.id)
    }

    @Delete(':projectId/scenes/:sceneId/rooms/:roomId')
    async removeRoom(
        @Param('projectId') projectId: string,
        @Param('sceneId') sceneId: string,
        @Param('roomId') roomId: string
    ) {
        await this.validateProject(projectId)
        await this.validateScene(projectId, sceneId)
        await this.validateRoom(projectId, sceneId, roomId)

        return await this.roomsService.removeRoom(roomId)
    }

    // TODO
    private async validateProject(projectId: string) {
        const projectExists = await this.projectsService.projectExists(projectId)

        if (!projectExists) {
            throw new NotFoundException(`Project with ID "${projectId}" not found.`)
        }
    }

    private async validateScene(projectId: string, sceneId: string) {
        const scene = await this.scenesService.getScene(sceneId)

        if (scene.projectId !== projectId) {
            throw new BadRequestException(`Project with ID "${projectId}" is invalid.`)
        }
    }

    private async validateRoom(projectId: string, sceneId: string, roomId: string) {
        const room = await this.roomsService.getRoom(roomId)

        if (room.projectId !== projectId) {
            throw new BadRequestException(`Project with ID "${projectId}" is invalid.`)
        }

        if (room.sceneId !== sceneId) {
            throw new BadRequestException(`Scene with ID "${sceneId}" is invalid.`)
        }
    }
}
