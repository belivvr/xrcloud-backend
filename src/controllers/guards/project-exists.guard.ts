import { Injectable } from '@nestjs/common'
import { EntityExistsGuard } from 'src/common'
import { ProjectsService } from 'src/services/projects/projects.service'

@Injectable()
export class ProjectExistsGuard extends EntityExistsGuard<ProjectsService> {
    protected readonly entityName = 'Project'
    protected readonly entityIdKey = 'projectId'

    constructor(private readonly projectsService: ProjectsService) {
        super(projectsService)
    }

    async entityExists(id: string): Promise<boolean> {
        return this.projectsService.projectExists(id)
    }
}
