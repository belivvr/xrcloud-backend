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
import { CreateRoomDto, UpdateRoomDto } from 'src/services/manage-asset/dto'
import { ManageAssetService } from 'src/services/manage-asset/manage-asset.service'
import { ApiRoomQueryDto, ApiRoomsQueryDto } from 'src/services/rooms/dto'
import { RoomsService } from 'src/services/rooms/rooms.service'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { ApiKeyAuthGuard } from './guards'

@Controller('api/rooms')
@UseGuards(ApiKeyAuthGuard)
export class ApiRoomsController {
    constructor(
        private readonly roomsService: RoomsService,
        private readonly scenesService: ScenesService,
        private readonly manageAssetService: ManageAssetService,
        @Inject(forwardRef(() => ClearService))
        private readonly clearService: ClearService
    ) {}

    @Post()
    async createRoom(@Body() createRoomDto: CreateRoomDto) {
        await this.scenesService.validateSceneExists(createRoomDto.sceneId)

        return await this.manageAssetService.createRoom(createRoomDto)
    }

    @Get()
    async findRooms(@Query() queryDto: ApiRoomsQueryDto) {
        const rooms = await this.roomsService.findRooms(queryDto)

        if (rooms.items.length === 0) {
            return { ...rooms, items: [] }
        }

        const dtos = await Promise.all(
            rooms.items.map((room) => this.roomsService.getRoomDto(room.id, queryDto.userId))
        )

        return { ...rooms, items: dtos }
    }

    @Get(':roomId')
    async getRoom(@Param('roomId') roomId: string, @Query() queryDto: ApiRoomQueryDto) {
        await this.roomsService.validateRoomExists(roomId)

        return await this.roomsService.getRoomDto(roomId, queryDto.userId)
    }

    @Patch(':roomId')
    async updateRoom(@Param('roomId') roomId: string, @Body() updateRoomDto: UpdateRoomDto) {
        await this.roomsService.validateRoomExists(roomId)

        return await this.manageAssetService.updateRoom(roomId, updateRoomDto)
    }

    @Delete(':roomId')
    async removeRoom(@Param('roomId') roomId: string) {
        return await this.clearService.clearRoom(roomId)
    }
}
