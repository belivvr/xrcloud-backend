import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from 'src/services/auth/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.getAdmin(email.toLowerCase(), password)

        if (!user) {
            Logger.log(`Login failed for email: ${email}`, 'Auth: login')

            throw new UnauthorizedException('Invalid credentials.')
        }

        return user
    }
}
