import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ProjectsService } from 'src/services/projects/projects.service'
import { ApiKeyAuthGuard } from './guards'

@Controller('api/projects')
@UseGuards(ApiKeyAuthGuard)
export class ApiProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get(':projectId')
    async getProject(@Param('projectId') projectId: string) {
        await this.projectsService.validateProjectExists(projectId)

        return await this.projectsService.getProjectDto(projectId)
    }
}
