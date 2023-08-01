import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ProjectKeyAuthGuard } from 'src/auth'
import { CreateRoomDto, QueryDto, UpdateRoomDto } from './dto'
import { RoomsService } from './rooms.service'

@Controller('rooms')
@UseGuards(ProjectKeyAuthGuard)
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Post()
    async create(@Headers('X-Xrcloud-Project-Id') projectId: string, @Body() createRoomDto: CreateRoomDto) {
        const room = await this.roomsService.create(projectId, createRoomDto)

        return await this.roomsService.getRoomDto(room.id)
    }

    @Get()
    async findAll(@Query() queryDto: QueryDto) {
        const rooms = await this.roomsService.findAll(queryDto)

        const items = await Promise.all(rooms.items.map((room) => this.roomsService.getRoomDto(room.id)))

        return { ...rooms, items }
    }

    @Get(':id')
    async findById(@Param('id') roomId: string) {
        return await this.roomsService.getRoomDto(roomId)
    }

    @Patch(':id')
    async update(
        @Headers('X-Xrcloud-Project-Id') projectId: string,
        @Param('id') roomId: string,
        @Body() updateRoomDto: UpdateRoomDto
    ) {
        const room = await this.roomsService.update(projectId, roomId, updateRoomDto)

        return await this.roomsService.getRoomDto(room.id)
    }

    @Delete(':id')
    async remove(@Param('id') roomId: string) {
        return await this.roomsService.remove(roomId)
    }
}
