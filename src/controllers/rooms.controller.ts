import {
    BadRequestException,
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
import { PublicApi, SkipAuth } from 'src/common'
import { ClearService } from 'src/services/clear/clear.service'
import { ManageAssetService } from 'src/services/manage-asset/manage-asset.service'
import {
    CreateRoomDto,
    OptionQueryDto,
    RoomQueryDto,
    RoomsQueryDto,
    UpdateRoomDto
} from 'src/services/rooms/dto'
import { RoomsService } from 'src/services/rooms/rooms.service'
import { HeaderAuthGuard, ProjectExistsGuard, SceneExistsGuard } from './guards'
import { RoomExistsGuard } from './guards/room-exists.guard'

@Controller('api/rooms')
@UseGuards(HeaderAuthGuard)
export class RoomsController {
    constructor(
        private readonly roomsService: RoomsService,
        private readonly manageAssetService: ManageAssetService,
        @Inject(forwardRef(() => ClearService))
        private readonly clearService: ClearService
    ) {}

    @Post()
    @PublicApi()
    @UseGuards(ProjectExistsGuard, SceneExistsGuard)
    async createRoom(@Body() createRoomDto: CreateRoomDto) {
        return await this.manageAssetService.createRoom(createRoomDto)
    }

    @Get()
    @PublicApi()
    async findRooms(@Query() queryDto: RoomsQueryDto) {
        if (!queryDto.projectId && !queryDto.sceneId) {
            throw new BadRequestException('Either projectId or sceneId must be provided')
        }

        return await this.roomsService.findRooms(queryDto)
    }

    @Get(':roomId')
    @PublicApi()
    @UseGuards(RoomExistsGuard)
    async getRoom(@Param('roomId') roomId: string, @Query() queryDto: RoomQueryDto) {
        return await this.roomsService.getRoomDto(roomId, queryDto.userId)
    }

    @Get('option/:optionId')
    @SkipAuth()
    async getRoomOption(@Param('optionId') optionId: string, @Query() queryDto: OptionQueryDto) {
        return await this.roomsService.getRoomOption(optionId, queryDto)
    }

    @Patch(':roomId')
    @PublicApi()
    @UseGuards(RoomExistsGuard)
    async updateRoom(@Param('roomId') roomId: string, @Body() updateRoomDto: UpdateRoomDto) {
        return await this.manageAssetService.updateRoom(roomId, updateRoomDto)
    }

    @Delete(':roomId')
    @PublicApi()
    @UseGuards(RoomExistsGuard)
    async removeRoom(@Param('roomId') roomId: string) {
        return await this.clearService.clearRoom(roomId)
    }
}
