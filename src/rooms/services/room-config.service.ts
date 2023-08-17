import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class RoomConfigService {
    public readonly roomOptionExpiration: string

    constructor(config: SafeConfigService) {
        this.roomOptionExpiration = config.getString('ROOM_OPTION_EXPIRATION')
    }
}
