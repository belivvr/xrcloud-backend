import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AdminsService } from 'src/admins'
import { JwtPayload } from '../interfaces'
import { AuthConfigService } from '../services'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(forwardRef(() => AdminsService))
        private readonly adminsService: AdminsService,
        config: AuthConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.accessSecret
        })
    }

    async validate(payload: JwtPayload) {
        const { adminId, email } = payload

        const adminExists = await this.adminsService.adminExists(adminId)

        return adminExists ? { adminId, email } : null
    }
}
