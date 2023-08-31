import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class EventConfigService {
    public readonly roomDetailsExpiration: string

    constructor(config: SafeConfigService) {
        this.roomDetailsExpiration = config.getString('ROOM_DETAILS_EXPIRATION')
    }
}
