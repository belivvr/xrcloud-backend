import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common'
import { Assert } from 'src/common'
import { AdminsService } from 'src/services/admins/admins.service'
import { CreateAdminDto, FindPasswordDto, ResetPasswordDto, UpdatePasswordDto } from 'src/services/admins/dto'
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
    async updatePassword(@Param('adminId') adminId: string, @Body() updatePasswordDto: UpdatePasswordDto) {
        return await this.adminsService.updatePassword(adminId, updatePasswordDto)
    }

    @Post(':adminId/generate-api-key')
    @UseGuards(HeaderAuthGuard, AdminExistsGuard)
    async generateApiKey(@Req() req: any) {
        Assert.defined(req.user, 'Authentication failed. req.user is null.')

        return await this.adminsService.generateApiKey(req.user.adminId)
    }

    @Post('find-password')
    async findPassword(@Body() findPasswordDto: FindPasswordDto) {
        return await this.adminsService.findPassword(findPasswordDto)
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.adminsService.resetPassword(resetPasswordDto)
    }

    @Delete(':adminId')
    @UseGuards(HeaderAuthGuard, AdminExistsGuard)
    async removeAdmin(@Param('adminId') adminId: string) {
        return await this.clearService.clearAdmin(adminId)
    }
}
