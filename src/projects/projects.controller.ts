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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { multerOptions } from 'src/middleware'
import { CreateProjectDto, QueryDto, UpdateProjectDto } from './dto'
import { ProjectsService } from './projects.service'
import { UploadedFilesType } from './types'

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
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
    async create(
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
    async findAll(@Query() queryDto: QueryDto, @Req() req: any) {
        if (!req.user) {
            throw new UnauthorizedException('Admin authentication failed')
        }

        const projects = await this.projectsService.findAll(queryDto, req.user.adminId)

        const dtos = await Promise.all(
            projects.items.map((project) => this.projectsService.getProjectDto(project.id))
        )

        return { ...projects, items: dtos }
    }

    @Get(':id')
    async findById(@Param('id') projectId: string) {
        await this.requireProjectExists(projectId)

        return await this.projectsService.getProjectDto(projectId)
    }

    @Patch(':id')
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
    async update(
        @Param('id') projectId: string,
        @Body() updateProjectDto: UpdateProjectDto,
        @UploadedFiles() files: UploadedFilesType
    ) {
        const project = await this.projectsService.update(projectId, updateProjectDto, files)

        return await this.projectsService.getProjectDto(project.id)
    }

    @Patch(':id/issue-key')
    async issueKey(@Param('id') projectId: string) {
        return await this.projectsService.issueKey(projectId)
    }

    @Delete(':id')
    async remove(@Param('id') projectId: string) {
        await this.requireProjectExists(projectId)

        return this.projectsService.remove(projectId)
    }

    private async requireProjectExists(projectId: string) {
        const projectExists = await this.projectsService.projectExists(projectId)

        if (!projectExists) {
            throw new NotFoundException(`Project with ID "${projectId}" not found`)
        }
    }
}
