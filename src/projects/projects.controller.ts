import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UnauthorizedException,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { AdminAuthGuard } from 'src/auth'
import { multerOptions } from 'src/middleware'
import { RoomsService } from 'src/rooms'
import { ScenesService } from 'src/scenes'
import { AdminCreateRoomDto, CreateProjectDto, QueryDto, UpdateProjectDto } from './dto'
import { ProjectsService } from './projects.service'
import { UploadedFilesType } from './types'

const FAVICON = 'favicon'
const LOGO = 'logo'

@Controller('console/projects')
@UseGuards(AdminAuthGuard)
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService
    ) {}

    /**
     * Projects
     */
    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: FAVICON, maxCount: 1 },
                { name: LOGO, maxCount: 1 }
            ],
            {
                fileFilter: multerOptions.imageFilter
            }
        )
    )
    async createProject(
        @Body() createProjectDto: CreateProjectDto,
        @UploadedFiles() files: UploadedFilesType,
        @Req() req: any
    ) {
        if (!req.user) {
            throw new UnauthorizedException('Admin authentication failed.')
        }

        if (!(await this.projectsService.restrictProjectCreation(req.user.adminId))) {
            throw new ForbiddenException(
                `Admin with ID "${req.user.adminId}" exceeds the number of projects that can be created.`
            )
        }

        if (!files[FAVICON] || !files[LOGO]) {
            throw new BadRequestException('Files is required.')
        }

        const project = await this.projectsService.createProject(createProjectDto, files, req.user.adminId)

        return await this.projectsService.getProjectDto(project.id)
    }

    @Get()
    async findProjects(@Query() queryDto: QueryDto, @Req() req: any) {
        if (!req.user) {
            throw new UnauthorizedException('Admin authentication failed.')
        }

        const projects = await this.projectsService.findProjects(queryDto, req.user.adminId)

        const dtos = await Promise.all(
            projects.items.map((project) => this.projectsService.getProjectDto(project.id))
        )

        return { ...projects, items: dtos }
    }

    @Get(':projectId')
    async getProject(@Param('projectId') projectId: string) {
        await this.validateProject(projectId)

        return await this.projectsService.getProjectDto(projectId)
    }

    @Patch(':projectId')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: FAVICON, maxCount: 1 },
                { name: LOGO, maxCount: 1 }
            ],
            {
                fileFilter: multerOptions.imageFilter
            }
        )
    )
    async updateProject(
        @Param('projectId') projectId: string,
        @Body() updateProjectDto: UpdateProjectDto,
        @UploadedFiles() files: UploadedFilesType
    ) {
        await this.validateProject(projectId)

        const project = await this.projectsService.updateProject(projectId, updateProjectDto, files)

        return await this.projectsService.getProjectDto(project.id)
    }

    @Delete(':projectId')
    async removeProject(@Param('projectId') projectId: string) {
        await this.validateProject(projectId)

        return await this.projectsService.removeProject(projectId)
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

    /**
     * Rooms
     */
    @Post(':projectId/scenes/:sceneId/rooms')
    async createRoom(
        @Param('projectId') projectId: string,
        @Param('sceneId') sceneId: string,
        @Body() createRoomDto: AdminCreateRoomDto
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
