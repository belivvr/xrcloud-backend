import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { AdminAuthGuard } from 'src/auth/guards'
import { CreateRoomDto, RoomQueryDto } from './dto'
import { RoomsService } from './rooms.service'
import { ScenesService } from 'src/scenes/scenes.service'

@Controller('console/rooms')
@UseGuards(AdminAuthGuard)
export class RoomsController {
    constructor(private readonly roomsService: RoomsService, private readonly scenesService: ScenesService) {}

    @Post()
    async createRoom(@Body() createRoomDto: CreateRoomDto) {
        await this.scenesService.validateSceneExists(createRoomDto.sceneId)

        const room = await this.roomsService.createRoom(createRoomDto)

        return await this.roomsService.getRoomDto(room.id)
    }

    @Get()
    async findRooms(@Query() roomQueryDto: RoomQueryDto) {
        const rooms = await this.roomsService.findRooms(roomQueryDto)

        if (rooms.items.length === 0) {
            return { ...rooms, items: [] }
        }

        const dtos = await Promise.all(rooms.items.map((room) => this.roomsService.getRoomDto(room.id)))

        return { ...rooms, items: dtos }
    }

    @Get(':roomId')
    async getRoom(@Param('roomId') roomId: string) {
        await this.roomsService.validateRoomExists(roomId)

        return await this.roomsService.getRoomDto(roomId)
    }
}
