import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { PUBLIC_API_KEY, SKIP_AUTH_KEY } from 'src/common'
import { AdminsService } from 'src/services/admins/admins.service'

@Injectable()
export class HeaderAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector, private readonly adminsService: AdminsService) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>(SKIP_AUTH_KEY, context.getHandler())

        if (isPublic) {
            return true
        }

        const request = context.switchToHttp().getRequest()

        const authHeader = request.header('Authorization')
        const apiKeyHeader = request.header('X-XRCLOUD-API-KEY')

        if (!authHeader && !apiKeyHeader) {
            throw new UnauthorizedException('Authorization header is required.')
        }

        if (authHeader) {
            return (await super.canActivate(context)) as boolean
        } else if (apiKeyHeader) {
            const isPublicApi = this.reflector.get<boolean>(PUBLIC_API_KEY, context.getHandler())

            if (isPublicApi) {
                return await this.apiKeyAuth(apiKeyHeader)
            } else {
                throw new UnauthorizedException('API key is not allowed for this route.')
            }
        }

        throw new UnauthorizedException('Invalid authorization method.')
    }

    private async apiKeyAuth(apiKey: string): Promise<boolean> {
        const admin = await this.adminsService.findAdminByApiKey(apiKey)

        if (!admin) {
            throw new UnauthorizedException('Invalid api key.')
        }

        return true
    }
}
