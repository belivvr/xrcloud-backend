import { Controller } from '@nestjs/common'
import { ScenesService } from './scenes.service'

@Controller('scenes')
export class ScenesController {
    constructor(private readonly scenesService: ScenesService) {}

    // @Get('new')
    // async getSceneCreationUrl(
    //     @Headers('X-Xrcloud-Project-Id') projectId: string,
    //     @Query() getSceneUrlDto: GetSceneUrlDto
    // ) {
    //     return await this.scenesService.getSceneCreationUrl(projectId, getSceneUrlDto)
    // }

    // @Get('modify')
    // async getModifySceneUrl(
    //     @Headers('X-Xrcloud-Project-Id') projectId: string,
    //     @Query() getModifySceneUrlDto: GetModifySceneUrlDto
    // ) {
    //     return await this.scenesService.getModifySceneUrl(projectId, getModifySceneUrlDto)
    // }

    // @Get()
    // async findAll(@Headers('X-Xrcloud-Project-Id') projectId: string, @Query() queryDto: QueryDto) {
    //     const scenes = await this.scenesService.findAll(projectId, queryDto)

    //     const items = await Promise.all(scenes.items.map((scene) => this.scenesService.getSceneDto(scene.id)))

    //     return { ...scenes, items }
    // }
}
