import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class SceneConfigService {
    public readonly sceneOptionExpiration: string

    constructor(config: SafeConfigService) {
        this.sceneOptionExpiration = config.getString('SCENE_OPTION_EXPIRATION')
    }
}
