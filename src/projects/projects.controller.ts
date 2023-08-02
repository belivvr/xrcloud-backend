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
import { ScenesService } from 'src/scenes'
import { CreateProjectDto, GetSceneUrlDto, QueryDto, UpdateProjectDto } from './dto'
import { ProjectsService } from './projects.service'
import { UploadedFilesType } from './types'

@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly scenesService: ScenesService
    ) {}

    /**
     * Projects
     */
    @Post()
    @UseGuards(AdminAuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'favicon', maxCount: 1 },
                { name: 'logo', maxCount: 1 }
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
            throw new UnauthorizedException('Admin authentication failed')
        }

        if (!(await this.projectsService.restrictProjectCreation(req.user.adminId))) {
            throw new ForbiddenException(
                `Admin with ID "${req.user.adminId}" exceeds the number of projects that can be created`
            )
        }

        if (!files['favicon'] || !files['logo']) {
            throw new BadRequestException('Files is required')
        }

        const project = await this.projectsService.create(createProjectDto, files, req.user.adminId)

        return await this.projectsService.getProjectDto(project.id)
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    async findProjects(@Query() queryDto: QueryDto, @Req() req: any) {
        if (!req.user) {
            throw new UnauthorizedException('Admin authentication failed')
        }

        const projects = await this.projectsService.findProjects(queryDto, req.user.adminId)

        const dtos = await Promise.all(
            projects.items.map((project) => this.projectsService.getProjectDto(project.id))
        )

        return { ...projects, items: dtos }
    }

    @Get(':projectId')
    @UseGuards(AdminAuthGuard)
    async getProject(@Param('projectId') projectId: string) {
        await this.requireProjectExists(projectId)

        return await this.projectsService.getProjectDto(projectId)
    }

    @Patch(':projectId')
    @UseGuards(AdminAuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'favicon', maxCount: 1 },
                { name: 'logo', maxCount: 1 }
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
        await this.requireProjectExists(projectId)

        const project = await this.projectsService.update(projectId, updateProjectDto, files)

        return await this.projectsService.getProjectDto(project.id)
    }

    @Patch(':projectId/generate-key')
    @UseGuards(AdminAuthGuard)
    async generateKey(@Param('id') projectId: string) {
        await this.requireProjectExists(projectId)

        return await this.projectsService.generateKey(projectId)
    }

    @Delete(':projectId')
    @UseGuards(AdminAuthGuard)
    async removeProject(@Param('projectId') projectId: string) {
        await this.requireProjectExists(projectId)

        return this.projectsService.remove(projectId)
    }

    /**
     * Scenes
     */
    @Get(':projectId/scenes/create-url')
    async getSceneCreationUrl(
        @Param('projectId') projectId: string,
        @Query() getSceneUrlDto: GetSceneUrlDto
    ) {
        const { personalId } = getSceneUrlDto

        const getSceneCreationUrlDto = {
            personalId: personalId,
            projectId: projectId
        }

        return await this.scenesService.getSceneCreationUrl(getSceneCreationUrlDto)
    }

    @Get(':projectId/scenes/:sceneId/modify-url')
    async getSceneModificationUrl(
        @Param('projectId') projectId: string,
        @Param('sceneId') sceneId: string,
        @Query() getSceneUrlDto: GetSceneUrlDto
    ) {
        const { personalId } = getSceneUrlDto

        const getSceneModificationUrlDto = {
            personalId: personalId,
            projectId: projectId,
            sceneId: sceneId
        }

        return await this.scenesService.getSceneModificationUrl(getSceneModificationUrlDto)
    }

    @Get(':projectId/scenes')
    async findScenes(@Param('projectId') projectId: string, @Query() queryDto: QueryDto) {
        const scenes = await this.scenesService.findScenes(projectId, queryDto)

        const items = await Promise.all(scenes.items.map((scene) => this.scenesService.getSceneDto(scene.id)))

        return { ...scenes, items }
    }

    @Get(':projectId/scenes/:sceneId')
    async getScene(@Param('projectId') projectId: string, @Param('sceneId') sceneId: string) {
        await this.requireProjectExists(projectId)
        await this.validateSceneId(projectId, sceneId)

        return await this.scenesService.getSceneDto(sceneId)
    }

    private async requireProjectExists(projectId: string) {
        const projectExists = await this.projectsService.projectExists(projectId)

        if (!projectExists) {
            throw new NotFoundException(`Project with ID "${projectId}" not found`)
        }
    }

    private async validateSceneId(projectId: string, sceneId: string) {
        const scene = await this.scenesService.getScene(sceneId)

        if (scene.projectId !== projectId) {
            throw new BadRequestException(`Project with ID "${sceneId}" is invalid`)
        }
    }
}
