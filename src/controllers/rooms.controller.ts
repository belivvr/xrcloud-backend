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
import { SkipAuth } from 'src/common'
import { ClearService } from 'src/services/clear/clear.service'
import { ManageAssetService } from 'src/services/manage-asset/manage-asset.service'
import { CreateRoomDto, OptionQueryDto, RoomsQueryDto } from 'src/services/rooms/dto'
import { RoomsService } from 'src/services/rooms/rooms.service'
import { AdminAuthGuard, ProjectExistsGuard, SceneExistsGuard } from './guards'
import { RoomExistsGuard } from './guards/room-exists.guard'

@Controller('console/rooms')
@UseGuards(AdminAuthGuard)
export class RoomsController {
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
    async getRoom(@Param('roomId') roomId: string) {
        return await this.roomsService.getRoomDto(roomId)
    }

    @Get('option/:optionId')
    @SkipAuth()
    async getRoomOption(@Param('optionId') optionId: string, @Query() queryDto: OptionQueryDto) {
        return await this.roomsService.getRoomOption(optionId, queryDto)
    }

    @Delete(':roomId')
    @UseGuards(RoomExistsGuard)
    async removeRoom(@Param('roomId') roomId: string) {
        return await this.clearService.clearRoom(roomId)
    }
}
