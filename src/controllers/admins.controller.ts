import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common'
import { Assert } from 'src/common'
import { AdminsService } from 'src/services/admins/admins.service'
import { CreateAdminDto, UpdatePasswordDto } from 'src/services/admins/dto'
import { ClearService } from 'src/services/clear/clear.service'
import { RegisterService } from 'src/services/register/register.service'
import { AdminExistsGuard, HeaderAuthGuard, UniqueEmailGuard } from './guards'

@Controller('admins')
export class AdminsController {
    constructor(
        private readonly adminsService: AdminsService,
        private readonly registerService: RegisterService,
        private readonly clearService: ClearService
    ) {}

    @Post()
    @UseGuards(UniqueEmailGuard)
    async createAdmin(@Body() createAdminDto: CreateAdminDto) {
        return await this.registerService.createAdmin(createAdminDto)
    }

    @Post(':adminId/update-password')
    @UseGuards(HeaderAuthGuard, AdminExistsGuard)
    async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Req() req: any) {
        Assert.defined(req.user, 'Authentication failed. req.user is null.')

        return await this.adminsService.updatePassword(updatePasswordDto, req.user.adminId)
    }

    @Post(':adminId/generate-api-key')
    @UseGuards(HeaderAuthGuard, AdminExistsGuard)
    async generateApiKey(@Req() req: any) {
        Assert.defined(req.user, 'Authentication failed. req.user is null.')

        return await this.adminsService.generateApiKey(req.user.adminId)
    }

    @Delete(':adminId')
    @UseGuards(HeaderAuthGuard, AdminExistsGuard)
    async removeAdmin(@Param('adminId') adminId: string, @Req() req: any) {
        Assert.defined(req.user, 'Authentication failed. req.user is null.')

        return await this.clearService.clearAdmin(adminId)
    }
}
