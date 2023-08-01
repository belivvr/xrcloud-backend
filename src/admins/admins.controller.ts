import {
    Body,
    ConflictException,
    Controller,
    Get,
    Headers,
    Param,
    Patch,
    Post,
    Query,
    UseGuards
} from '@nestjs/common'
import { ProjectKeyAuthGuard } from 'src/auth'
import { AdminsService } from './admins.service'
import {
    AdminCreateRoomDto,
    AdminDto,
    AdminGetModifySceneUrlDto,
    AdminUpdateRoomDto,
    CreateAdminDto
} from './dto'

// TODO: move to projects?
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
    @UseGuards(ProjectKeyAuthGuard)
    async getNewSceneUrl(@Headers('X-Xrcloud-Project-Id') projectId: string) {
        return await this.adminsService.getNewSceneUrl(projectId)
    }

    @Get('scenes/modify')
    @UseGuards(ProjectKeyAuthGuard)
    async getModifySceneUrl(
        @Headers('X-Xrcloud-Project-Id') projectId: string,
        @Query() getModifySceneUrlDto: AdminGetModifySceneUrlDto
    ) {
        return await this.adminsService.getModifySceneUrl(projectId, getModifySceneUrlDto)
    }

    @Post('rooms')
    @UseGuards(ProjectKeyAuthGuard)
    async createRoom(
        @Headers('X-Xrcloud-Project-Id') projectId: string,
        @Body() createRoomDto: AdminCreateRoomDto
    ) {
        return await this.adminsService.createRoom(projectId, createRoomDto)
    }

    @Patch('rooms/:id')
    @UseGuards(ProjectKeyAuthGuard)
    async updateRoom(
        @Headers('X-Xrcloud-Project-Id') projectId: string,
        @Param('id') roomId: string,
        @Body() updateRoomDto: AdminUpdateRoomDto
    ) {
        return await this.adminsService.updateRoom(projectId, roomId, updateRoomDto)
    }
}
