import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AdminsService } from 'src/services/admins/admins.service'
import { AuthConfigService } from 'src/services/auth/auth-config.service'
import { JwtPayload } from '../interfaces'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly adminsService: AdminsService, configService: AuthConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.accessSecret
        })
    }

    async validate(payload: JwtPayload) {
        const { adminId, email } = payload

        const adminExists = await this.adminsService.adminExists(adminId)

        return adminExists ? { adminId, email } : null
    }
}
