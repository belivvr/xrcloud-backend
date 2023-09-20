import { Controller, Delete, Get, Inject, Param, Query, UseGuards, forwardRef } from '@nestjs/common'
import { ClearService } from 'src/services/clear/clear.service'
import { ScenesQueryDto } from 'src/services/scenes/dto'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { ApiKeyAuthGuard, SceneExistsGuard } from './guards'

@Controller('api/scenes')
@UseGuards(ApiKeyAuthGuard)
export class ApiScenesController {
    constructor(
        private readonly scenesService: ScenesService,
        @Inject(forwardRef(() => ClearService))
        private readonly clearService: ClearService
    ) {}

    @Get()
    async findScenes(@Query() queryDto: ScenesQueryDto) {
        return await this.scenesService.findScenes(queryDto)
    }

    @Get(':sceneId')
    @UseGuards(SceneExistsGuard)
    async getScene(@Param('sceneId') sceneId: string) {
        return await this.scenesService.getSceneDto(sceneId)
    }

    @Delete(':sceneId')
    @UseGuards(SceneExistsGuard)
    async removeScene(@Param('sceneId') sceneId: string) {
        return await this.clearService.clearScene(sceneId)
    }
}
