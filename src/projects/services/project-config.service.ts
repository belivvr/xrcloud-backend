import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class ProjectConfigService {
    public readonly userAccessTokenExpiration: string

    constructor(config: SafeConfigService) {
        this.userAccessTokenExpiration = config.getString('USER_ACCESS_TOKEN_EXPIRATION')
    }
}
