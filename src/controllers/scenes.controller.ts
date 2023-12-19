import { Controller, Delete, Get, Inject, Param, Patch, Query, UseGuards, forwardRef } from '@nestjs/common'
import { PublicApi, SkipAuth } from 'src/common'
import { ClearService } from 'src/services/clear/clear.service'
import { ScenesQueryDto } from 'src/services/scenes/dto'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { HeaderAuthGuard, SceneExistsGuard } from './guards'

@Controller('api/scenes')
@UseGuards(HeaderAuthGuard)
export class ScenesController {
    constructor(
        private readonly scenesService: ScenesService,
        @Inject(forwardRef(() => ClearService))
        private readonly clearService: ClearService
    ) {}

    @Get()
    @PublicApi()
    async findScenes(@Query() queryDto: ScenesQueryDto) {
        return await this.scenesService.findScenes(queryDto)
    }

    @Get(':sceneId')
    @PublicApi()
    @UseGuards(SceneExistsGuard)
    async getScene(@Param('sceneId') sceneId: string) {
        return await this.scenesService.getSceneDto(sceneId)
    }

    @Get('option/:optionId')
    @SkipAuth()
    async getSceneOption(@Param('optionId') optionId: string) {
        return await this.scenesService.getSceneOption(optionId)
    }

    @Delete(':sceneId')
    @PublicApi()
    @UseGuards(SceneExistsGuard)
    async removeScene(@Param('sceneId') sceneId: string) {
        return await this.clearService.clearScene(sceneId)
    }
}
