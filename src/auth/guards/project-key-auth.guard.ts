import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    BadRequestException,
    Inject,
    forwardRef
} from '@nestjs/common'
import { Request } from 'express'
import { ProjectsService } from 'src/projects'

@Injectable()
export class ProjectKeyAuthGuard implements CanActivate {
    constructor(
        @Inject(forwardRef(() => ProjectsService))
        private readonly projectsService: ProjectsService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>()
        const authHeader = request.header('Authorization')
        const projectId = request.params.projectId

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is required')
        }

        if (!projectId) {
            throw new BadRequestException('ProjectId is required')
        }

        const [bearer, ...tokenParts] = authHeader.split(' ')

        if (bearer.toLowerCase() !== 'bearer') {
            throw new UnauthorizedException('Invalid authorization format')
        }

        const projectKey = tokenParts.join(' ')

        const project = await this.projectsService.getProject(projectId)

        const expectedProjectKey = project.projectKey

        if (projectKey !== expectedProjectKey) {
            throw new UnauthorizedException('Invalid project key')
        }

        return true
    }
}
