import { Injectable } from '@nestjs/common'
import { EntityExistsGuard } from 'src/common'
import { ScenesService } from 'src/services/scenes/scenes.service'

@Injectable()
export class SceneExistsGuard extends EntityExistsGuard<ScenesService> {
    protected readonly entityName = 'Scene'
    protected readonly entityIdKey = 'sceneId'

    constructor(private readonly scenesService: ScenesService) {
        super(scenesService)
    }

    async entityExists(id: string): Promise<boolean> {
        return this.scenesService.sceneExists(id)
    }
}
