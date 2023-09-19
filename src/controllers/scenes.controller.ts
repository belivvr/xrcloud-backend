import { Controller, Delete, Get, Inject, Param, Patch, Query, UseGuards, forwardRef } from '@nestjs/common'
import { ClearService } from 'src/services/clear/clear.service'
import { ScenesQueryDto } from 'src/services/scenes/dto'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { AdminAuthGuard } from './guards'

@Controller('console/scenes')
@UseGuards(AdminAuthGuard)
export class ScenesController {
    constructor(
        private readonly scenesService: ScenesService,
        @Inject(forwardRef(() => ClearService))
        private readonly clearService: ClearService
    ) {}

    @Get()
    async findScenes(@Query() queryDto: ScenesQueryDto) {
        const scenes = await this.scenesService.findScenes(queryDto)

        if (scenes.items.length === 0) {
            return { ...scenes, items: [] }
        }

        const dtos = await Promise.all(scenes.items.map((scene) => this.scenesService.getSceneDto(scene.id)))

        return { ...scenes, items: dtos }
    }

    @Get(':sceneId')
    async getScene(@Param('sceneId') sceneId: string) {
        await this.scenesService.validateSceneExists(sceneId)

        return await this.scenesService.getSceneDto(sceneId)
    }

    @Get('option/:optionId')
    async getSceneOption(@Param('optionId') optionId: string) {
        return await this.scenesService.getSceneOption(optionId)
    }

    @Patch(':sceneId/toggle-public-room')
    async togglePublicRoom(@Param('sceneId') sceneId: string) {
        await this.scenesService.validateSceneExists(sceneId)

        return await this.scenesService.togglePublicRoom(sceneId)
    }

    @Delete(':sceneId')
    async removeScene(@Param('sceneId') sceneId: string) {
        return await this.clearService.clearScene(sceneId)
    }
}
