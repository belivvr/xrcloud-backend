import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ProjectsService } from 'src/services/projects/projects.service'
import { ApiKeyAuthGuard, ProjectExistsGuard } from './guards'

@Controller('api/projects')
@UseGuards(ApiKeyAuthGuard)
export class ApiProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get(':projectId')
    @UseGuards(ProjectExistsGuard)
    async getProject(@Param('projectId') projectId: string) {
        return await this.projectsService.getProjectDto(projectId)
    }
}
