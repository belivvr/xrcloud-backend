import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class ProjectConfigService {
    public readonly sceneOptionExpiration: string

    constructor(config: SafeConfigService) {
        this.sceneOptionExpiration = config.getString('SCENE_OPTION_EXPIRATION')
    }
}
