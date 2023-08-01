import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Admin } from 'src/admins'
import { LogicException } from 'src/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard, LocalAuthGuard } from './guards'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Req() req: AuthRequest) {
        if (!req.user) {
            throw new LogicException('login failed. req.user is null.')
        }

        return this.authService.login(req.user)
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: AuthRequest) {
        if (!req.user) {
            throw new LogicException('getProfile failed. req.user is null.')
        }

        return req.user
    }

    @Post('refresh')
    async refreshToken(@Body('refreshToken') refreshToken: string) {
        const payload = await this.authService.refreshTokenPair(refreshToken)

        if (!payload) {
            throw new UnauthorizedException('refresh failed.')
        }

        return payload
    }
}

interface AuthRequest {
    user: Admin | null
}
