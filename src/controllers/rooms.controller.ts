import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Query,
    UseGuards,
    forwardRef
} from '@nestjs/common'
import { ClearService } from 'src/services/clear/clear.service'
import { CreateRoomDto } from 'src/services/manage-asset/dto'
import { ManageAssetService } from 'src/services/manage-asset/manage-asset.service'
import { OptionQueryDto, RoomQueryDto } from 'src/services/rooms/dto'
import { RoomsService } from 'src/services/rooms/rooms.service'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { AdminAuthGuard } from './guards'

@Controller('console/rooms')
@UseGuards(AdminAuthGuard)
export class RoomsController {
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

    @Get('option/:optionId')
    async getRoomOption(@Param('optionId') optionId: string, @Query() queryDto: OptionQueryDto) {
        return await this.roomsService.getRoomOption(optionId, queryDto)
    }

    @Delete(':roomId')
    async removeRoom(@Param('roomId') roomId: string) {
        return await this.clearService.clearRoom(roomId)
    }
}
