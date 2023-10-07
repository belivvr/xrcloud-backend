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
import { ManageAssetService } from 'src/services/manage-asset/manage-asset.service'
import { CreateRoomDto, RoomQueryDto, RoomsQueryDto, UpdateRoomDto } from 'src/services/rooms/dto'
import { RoomsService } from 'src/services/rooms/rooms.service'
import { ApiKeyAuthGuard, ProjectExistsGuard, SceneExistsGuard } from './guards'
import { RoomExistsGuard } from './guards/room-exists.guard'

@Controller('api/rooms')
@UseGuards(ApiKeyAuthGuard)
export class ApiRoomsController {
    constructor(
        private readonly roomsService: RoomsService,
        private readonly manageAssetService: ManageAssetService,
        @Inject(forwardRef(() => ClearService))
        private readonly clearService: ClearService
    ) {}

    @Post()
    @UseGuards(ProjectExistsGuard, SceneExistsGuard)
    async createRoom(@Body() createRoomDto: CreateRoomDto) {
        return await this.manageAssetService.createRoom(createRoomDto)
    }

    @Get()
    async findRooms(@Query() queryDto: RoomsQueryDto) {
        return await this.roomsService.findRooms(queryDto)
    }

    @Get(':roomId')
    @UseGuards(RoomExistsGuard)
    async getRoom(@Param('roomId') roomId: string, @Query() queryDto: RoomQueryDto) {
        return await this.roomsService.getRoomDto(roomId, queryDto.userId)
    }

    @Patch(':roomId')
    @UseGuards(RoomExistsGuard)
    async updateRoom(@Param('roomId') roomId: string, @Body() updateRoomDto: UpdateRoomDto) {
        return await this.manageAssetService.updateRoom(roomId, updateRoomDto)
    }

    @Delete(':roomId')
    @UseGuards(RoomExistsGuard)
    async removeRoom(@Param('roomId') roomId: string) {
        return await this.clearService.clearRoom(roomId)
    }
}
