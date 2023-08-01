import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common'
import { ProjectKeyAuthGuard } from 'src/auth'
import { GetModifySceneUrlDto, GetSceneUrlDto, QueryDto } from './dto'
import { ScenesService } from './scenes.service'

@Controller('scenes')
@UseGuards(ProjectKeyAuthGuard)
export class ScenesController {
    constructor(private readonly scenesService: ScenesService) {}

    @Get('new')
    async getNewSceneUrl(
        @Headers('X-Xrcloud-Project-Id') projectId: string,
        @Query() getSceneUrlDto: GetSceneUrlDto
    ) {
        return await this.scenesService.getNewSceneUrl(projectId, getSceneUrlDto)
    }

    @Get('modify')
    async getModifySceneUrl(
        @Headers('X-Xrcloud-Project-Id') projectId: string,
        @Query() getModifySceneUrlDto: GetModifySceneUrlDto
    ) {
        return await this.scenesService.getModifySceneUrl(projectId, getModifySceneUrlDto)
    }

    @Get()
    async findAll(@Headers('X-Xrcloud-Project-Id') projectId: string, @Query() queryDto: QueryDto) {
        const scenes = await this.scenesService.findAll(projectId, queryDto)

        const items = await Promise.all(scenes.items.map((scene) => this.scenesService.getSceneDto(scene.id)))

        return { ...scenes, items }
    }
}
