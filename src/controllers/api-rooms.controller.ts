import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    forwardRef
} from '@nestjs/common'
import { ClearService } from 'src/services/clear/clear.service'
import { ApiRoomQueryDto, ApiRoomUserQueryDto, CreateRoomDto, UpdateRoomDto } from 'src/services/rooms/dto'
import { RoomsService } from 'src/services/rooms/rooms.service'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { ApiKeyAuthGuard } from './guards'

@Controller('api/rooms')
@UseGuards(ApiKeyAuthGuard)
export class ApiRoomsController {
    constructor(
        private readonly roomsService: RoomsService,
        private readonly scenesService: ScenesService,
        @Inject(forwardRef(() => ClearService))
        private readonly clearService: ClearService
    ) {}

    @Post()
    async createRoom(@Body() createRoomDto: CreateRoomDto) {
        await this.scenesService.validateSceneExists(createRoomDto.sceneId)

        const room = await this.roomsService.createRoom(createRoomDto)

        return await this.roomsService.getRoomDto(room.id)
    }

    @Get()
    async findRooms(@Query() roomQueryDto: ApiRoomQueryDto) {
        const rooms = await this.roomsService.findRooms(roomQueryDto)

        if (rooms.items.length === 0) {
            return { ...rooms, items: [] }
        }

        const dtos = await Promise.all(
            rooms.items.map((room) => this.roomsService.getRoomDto(room.id, roomQueryDto.userId))
        )

        return { ...rooms, items: dtos }
    }

    @Get(':roomId')
    async getRoom(@Param('roomId') roomId: string, @Query() roomQueryDto: ApiRoomUserQueryDto) {
        await this.roomsService.validateRoomExists(roomId)

        return await this.roomsService.getRoomDto(roomId, roomQueryDto.userId)
    }

    @Patch(':roomId')
    async updateRoom(@Param('roomId') roomId: string, @Body() updateRoomDto: UpdateRoomDto) {
        await this.roomsService.validateRoomExists(roomId)

        const room = await this.roomsService.updateRoom(roomId, updateRoomDto)

        return await this.roomsService.getRoomDto(room.id)
    }

    @Delete(':roomId')
    async removeRoom(@Param('roomId') roomId: string) {
        return await this.clearService.clearRoom(roomId)
    }
}
