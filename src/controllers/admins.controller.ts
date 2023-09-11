import { Body, ConflictException, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common'
import { Assert } from 'src/common'
import { AdminsService } from 'src/services/admins/admins.service'
import { AdminDto, CreateAdminDto, UpdatePasswordDto } from 'src/services/admins/dto'
import { ClearService } from 'src/services/clear/clear.service'
import { AdminAuthGuard } from './guards'

@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService, private readonly clearService: ClearService) {}

    @Post()
    async createAdmin(@Body() createAdminDto: CreateAdminDto) {
        const emailExists = await this.adminsService.emailExists(createAdminDto.email)

        if (emailExists) {
            throw new ConflictException(`Admin with email ${createAdminDto.email} already exists.`)
        }

        const admin = await this.adminsService.createAdmin(createAdminDto)

        return new AdminDto(admin)
    }

    @Post('update-password')
    @UseGuards(AdminAuthGuard)
    async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Req() req: any) {
        Assert.defined(req.user, 'Authentication failed. req.user is null.')

        await this.adminsService.validateAdminExists(req.user.adminId)

        const admin = await this.adminsService.updatePassword(updatePasswordDto, req.user.adminId)

        return new AdminDto(admin)
    }

    @Post('generate-api-key')
    @UseGuards(AdminAuthGuard)
    async generateApiKey(@Req() req: any) {
        Assert.defined(req.user, 'Authentication failed. req.user is null.')

        const admin = await this.adminsService.generateApiKey(req.user.adminId)

        return new AdminDto(admin)
    }

    @Delete(':adminId')
    @UseGuards(AdminAuthGuard)
    async removeAdmin(@Param('adminId') adminId: string, @Req() req: any) {
        Assert.defined(req.user, 'Authentication failed. req.user is null.')

        return await this.clearService.clearAdmin(adminId)
    }
}
