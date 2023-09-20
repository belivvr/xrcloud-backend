import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { SKIP_AUTH_KEY } from 'src/common'

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (this.reflector.get<boolean>(SKIP_AUTH_KEY, context.getHandler())) {
            return true
        }

        return (await super.canActivate(context)) as boolean
    }
}
