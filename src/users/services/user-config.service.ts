import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class UserConfigService {
    public readonly accessTokenExpiration: string

    constructor(config: SafeConfigService) {
        this.accessTokenExpiration = config.getString('USER_ACCESS_TOKEN_EXPIRATION')
    }
}
