import { Body, ConflictException, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common'
import { AdminsService } from './admins.service'
import {
    AdminCreateRoomDto,
    AdminDto,
    AdminGetModifySceneUrlDto,
    AdminUpdateRoomDto,
    CreateAdminDto
} from './dto'

@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}

    @Post()
    async create(@Body() createAdminDto: CreateAdminDto) {
        const emailExists = await this.adminsService.emailExists(createAdminDto.email)

        if (emailExists) {
            throw new ConflictException(`Admin with email ${createAdminDto.email} already exists`)
        }

        const admin = await this.adminsService.create(createAdminDto)

        return new AdminDto(admin)
    }

    @Get('scenes/new')
    async getSceneCreationUrl(@Headers('X-Xrcloud-Project-Id') projectId: string) {
        return await this.adminsService.getSceneCreationUrl(projectId)
    }

    @Get('scenes/modify')
    async getSceneModificationUrl(
        @Headers('X-Xrcloud-Project-Id') projectId: string,
        @Query() getModifySceneUrlDto: AdminGetModifySceneUrlDto
    ) {
        return await this.adminsService.getSceneModificationUrl(projectId, getModifySceneUrlDto)
    }

    @Post('rooms')
    async createRoom(
        @Headers('X-Xrcloud-Project-Id') projectId: string,
        @Body() createRoomDto: AdminCreateRoomDto
    ) {
        return await this.adminsService.createRoom(projectId, createRoomDto)
    }

    @Patch('rooms/:id')
    async updateRoom(
        @Headers('X-Xrcloud-Project-Id') projectId: string,
        @Param('id') roomId: string,
        @Body() updateRoomDto: AdminUpdateRoomDto
    ) {
        return await this.adminsService.updateRoom(projectId, roomId, updateRoomDto)
    }
}
