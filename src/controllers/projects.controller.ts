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
import { Assert } from 'src/common'
import { multerOptions } from 'src/middleware'
import { ClearService } from 'src/services/clear/clear.service'
import { CreateProjectDto, UpdateProjectDto } from 'src/services/manage-asset/dto'
import { ManageAssetService } from 'src/services/manage-asset/manage-asset.service'
import { UploadedFilesType } from 'src/services/manage-asset/types'
import { QueryDto } from 'src/services/projects/dto'
import { ProjectsService } from 'src/services/projects/projects.service'
import { AdminAuthGuard } from './guards'

const FAVICON = 'favicon'
const LOGO = 'logo'

@Controller('console/projects')
@UseGuards(AdminAuthGuard)
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly manageAssetService: ManageAssetService,
        @Inject(forwardRef(() => ClearService))
        private readonly clearService: ClearService
    ) {}

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

        const project = await this.manageAssetService.createProject(createProjectDto, files, req.user.adminId)

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
        await this.projectsService.validateProjectExists(projectId)

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
        await this.projectsService.validateProjectExists(projectId)

        const project = await this.manageAssetService.updateProject(projectId, updateProjectDto, files)

        return await this.projectsService.getProjectDto(project.id)
    }

    @Delete(':projectId')
    async removeProject(@Param('projectId') projectId: string) {
        return await this.clearService.clearProject(projectId)
    }
}
