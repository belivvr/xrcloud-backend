import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    forwardRef
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { AdminAuthGuard } from 'src/auth'
import { Assert } from 'src/common'
import { multerOptions } from 'src/middleware'
import { ReticulumService } from 'src/reticulum'
import { RoomsService } from 'src/rooms'
import { ScenesService } from 'src/scenes'
import { AdminCreateRoomDto, CreateProjectDto, QueryDto, UpdateProjectDto } from './dto'
import { ProjectsService } from './projects.service'
import { ProjectConfigService, ValidationService } from './services'
import { UploadedFilesType } from './types'

const FAVICON = 'favicon'
const LOGO = 'logo'

@Controller('console/projects')
@UseGuards(AdminAuthGuard)
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly configService: ProjectConfigService,
        private readonly validationService: ValidationService,
        private readonly scenesService: ScenesService,
        @Inject(forwardRef(() => RoomsService))
        private readonly roomsService: RoomsService,
        private readonly reticulumService: ReticulumService
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
        Assert.defined(req.user, 'Admin authentication failed. req.user is null.')

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
        Assert.defined(req.user, 'Admin authentication failed. req.user is null.')

        const projects = await this.projectsService.findProjects(queryDto, req.user.adminId)

        if (projects.items.length === 0) {
            return { ...projects, items: [] }
        }

        const dtos = await Promise.all(
            projects.items.map((project) => this.projectsService.getProjectDto(project.id))
        )

        return { ...projects, items: dtos }
    }

    @Get(':projectId')
    async getProject(@Param('projectId') projectId: string) {
        await this.validationService.validateProject(projectId)

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
        await this.validationService.validateProject(projectId)

        const project = await this.projectsService.updateProject(projectId, updateProjectDto, files)

        return await this.projectsService.getProjectDto(project.id)
    }

    @Delete(':projectId')
    async removeProject(@Param('projectId') projectId: string) {
        await this.validationService.validateProject(projectId)

        return await this.projectsService.removeProject(projectId)
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

    /**
     * Rooms
     */
    @Post(':projectId/scenes/:sceneId/rooms')
    async createRoom(
        @Param('projectId') projectId: string,
        @Param('sceneId') sceneId: string,
        @Body() createRoomDto: AdminCreateRoomDto
    ) {
        await this.validationService.validateScene(projectId, sceneId)

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
        await this.validationService.validateScene(projectId, sceneId)

        const rooms = await this.roomsService.findRooms({ sceneId, ...queryDto })

        if (rooms.items.length === 0) {
            return { ...rooms, items: [] }
        }

        const token = await this.reticulumService.getToken(
            projectId,
            this.configService.userAccessTokenExpiration
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
        @Param('roomId') roomId: string
    ) {
        await this.validationService.validateRoom(projectId, sceneId, roomId)

        const token = await this.reticulumService.getToken(
            projectId,
            this.configService.userAccessTokenExpiration
        )

        return await this.roomsService.getRoomDto(roomId, token)
    }
}
