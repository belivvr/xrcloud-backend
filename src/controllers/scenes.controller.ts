import { Controller, Delete, Get, Inject, Param, Query, UseGuards, forwardRef } from '@nestjs/common'
import { PublicApi, SkipAuth } from 'src/common'
import { ClearService } from 'src/services/clear/clear.service'
import { GetSceneCreationUrlDto, ScenesQueryDto } from 'src/services/scenes/dto'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { HeaderAuthGuard, ProjectExistsGuard, SceneExistsGuard } from './guards'

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

    @Get('get-creation-url')
    @PublicApi()
    @UseGuards(ProjectExistsGuard)
    async getSceneCreationUrl(@Query() queryDto: GetSceneCreationUrlDto) {
        return await this.scenesService.getSceneCreationUrl(queryDto)
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
