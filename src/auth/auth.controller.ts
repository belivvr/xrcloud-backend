import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
    forwardRef
} from '@nestjs/common'
import { AdminsService } from 'src/admins/admins.service'
import { AdminDto } from 'src/admins/dto'
import { Assert } from 'src/common'
import { AuthService } from './auth.service'
import { AdminAuthGuard, LocalAuthGuard } from './guards'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @Inject(forwardRef(() => AdminsService))
        private readonly adminsService: AdminsService
    ) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Req() req: any) {
        Assert.defined(req.user, 'Login failed. req.user is null.')

        return this.authService.login(req.user)
    }

    @Get('profile')
    @UseGuards(AdminAuthGuard)
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
}
