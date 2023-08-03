import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { AdminsService } from './admins.service'
import {
    AdminDto,
    CreateAdminDto
} from './dto'

@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}

    @Post()
    async create(@Body() createAdminDto: CreateAdminDto) {
        const emailExists = await this.adminsService.emailExists(createAdminDto.email)

        if (emailExists) {
            throw new ConflictException(`Admin with email ${createAdminDto.email} already exists.`)
        }

        const admin = await this.adminsService.create(createAdminDto)

        return new AdminDto(admin)
    }
}
