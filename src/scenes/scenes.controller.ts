import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { AdminAuthGuard } from 'src/auth/guards'
import { SceneQueryDto } from './dto'
import { ScenesService } from './scenes.service'

@Controller('console/scenes')
@UseGuards(AdminAuthGuard)
export class ScenesController {
    constructor(private readonly scenesService: ScenesService) {}

    @Get()
    async findScenes(@Query() sceneQueryDto: SceneQueryDto) {
        const scenes = await this.scenesService.findScenes(sceneQueryDto)

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
}
