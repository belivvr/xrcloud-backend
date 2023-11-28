import { Body, Controller, Get, Logger, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Assert } from 'src/common'
import { AdminsService } from 'src/services/admins/admins.service'
import { AdminDto } from 'src/services/admins/dto'
import { AuthService } from 'src/services/auth/auth.service'
import { HeaderAuthGuard, LocalAuthGuard } from './guards'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly adminsService: AdminsService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Req() req: any) {
        Assert.defined(req.user, 'Login failed. req.user is null.')

        Logger.log(`Login success for email: ${req.user.email}`, 'Auth: login')

        return this.authService.login(req.user)
    }

    @Get('profile')
    @UseGuards(HeaderAuthGuard)
    async getProfile(@Req() req: any) {
        Assert.defined(req.user, 'GetProfile failed. req.user is null.')

        const admin = await this.adminsService.getAdmin(req.user.adminId)

        return new AdminDto(admin)
    }

    @Post('refresh')
    async refreshToken(@Body('refreshToken') refreshToken: string) {
        const payload = await this.authService.refreshTokenPair(refreshToken)

        if (!payload) {
            throw new UnauthorizedException('Refresh failed.')
        }

        return payload
    }

    @Post('logout')
    @UseGuards(HeaderAuthGuard)
    async logout(@Req() req: any) {
        Assert.defined(req.user, 'Logout failed. req.user is null.')

        Logger.log(`Logout success for email: ${req.user.email}`, 'Auth: logout')

        await this.authService.logout(req.user.adminId)
    }
}
