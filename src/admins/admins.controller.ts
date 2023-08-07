import { Body, ConflictException, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { AdminsService } from './admins.service'
import { AdminDto, CreateAdminDto } from './dto'
import { AdminAuthGuard } from 'src/auth'
import { LogicException } from 'src/common'

@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}

    @Post()
    async createAdmin(@Body() createAdminDto: CreateAdminDto) {
        const emailExists = await this.adminsService.emailExists(createAdminDto.email)

        if (emailExists) {
            throw new ConflictException(`Admin with email ${createAdminDto.email} already exists.`)
        }

        const admin = await this.adminsService.createAdmin(createAdminDto)

        return new AdminDto(admin)
    }

    @Patch('api-key')
    @UseGuards(AdminAuthGuard)
    async generateApiKey(@Req() req: any) {
        if (!req.user) {
            throw new LogicException('authentication failed. req.user is null.')
        }

        const admin = await this.adminsService.generateApiKey(req.user.adminId)

        return new AdminDto(admin)
    }
}
