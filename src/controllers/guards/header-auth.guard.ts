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
        const isSkipAuth = this.reflector.get<boolean>(SKIP_AUTH_KEY, context.getHandler())

        if (isSkipAuth) {
            return true
        }

        const request = context.switchToHttp().getRequest()

        const authValue = request.header('Authorization')
        const apiKeyValue = request.header('X-XRCLOUD-API-KEY')

        if (authValue) {
            return (await super.canActivate(context)) as boolean
        } else if (apiKeyValue) {
            const isPublicApi = this.reflector.get<boolean>(PUBLIC_API_KEY, context.getHandler())

            if (isPublicApi) {
                return await this.apiKeyAuth(apiKeyValue)
            } else {
                throw new UnauthorizedException('API key is not allowed for this route.')
            }
        }

        throw new UnauthorizedException('Authorization header is required.')
    }

    private async apiKeyAuth(apiKey: string): Promise<boolean> {
        const admin = await this.adminsService.findAdminByApiKey(apiKey)

        if (!admin) {
            throw new UnauthorizedException('Invalid api key.')
        }

        return true
    }
}
