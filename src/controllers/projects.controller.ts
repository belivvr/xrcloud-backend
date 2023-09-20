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
import { FAVICON, LOGO } from 'src/common/constants'
import { multerOptions } from 'src/middleware'
import { ClearService } from 'src/services/clear/clear.service'
import { UploadedFilesType } from 'src/services/manage-asset/types'
import { CreateProjectDto, ProjectsQueryDto, UpdateProjectDto } from 'src/services/projects/dto'
import { ProjectsService } from 'src/services/projects/projects.service'
import { AdminAuthGuard, ProjectExistsGuard } from './guards'

@Controller('console/projects')
@UseGuards(AdminAuthGuard)
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
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

        return await this.projectsService.createProject(createProjectDto, files, req.user.adminId)
    }

    @Get()
    async findProjects(@Query() queryDto: ProjectsQueryDto, @Req() req: any) {
        Assert.defined(req.user, 'Admin authentication failed. req.user is null.')

        return await this.projectsService.findProjects(queryDto, req.user.adminId)
    }

    @Get(':projectId')
    @UseGuards(ProjectExistsGuard)
    async getProject(@Param('projectId') projectId: string) {
        return await this.projectsService.getProjectDto(projectId)
    }

    @Patch(':projectId')
    @UseGuards(ProjectExistsGuard)
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
        return await this.projectsService.updateProject(projectId, updateProjectDto, files)
    }

    @Delete(':projectId')
    async removeProject(@Param('projectId') projectId: string) {
        return await this.clearService.clearProject(projectId)
    }
}
