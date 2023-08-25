import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
    forwardRef
} from '@nestjs/common'
import { Request } from 'express'
import { AdminsService } from 'src/admins/admins.service'

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
    constructor(
        @Inject(forwardRef(() => AdminsService))
        private readonly adminsService: AdminsService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>()
        const authHeader = request.header('Authorization')

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is required.')
        }

        const [bearer, ...tokenParts] = authHeader.split(' ')

        if (bearer.toLowerCase() !== 'bearer') {
            throw new UnauthorizedException('Invalid authorization format.')
        }

        const apiKey = tokenParts.join(' ')

        const admin = await this.adminsService.findAdminByApiKey(apiKey)

        if (!admin) {
            throw new UnauthorizedException('Invalid api key.')
        }

        return true
    }
}
