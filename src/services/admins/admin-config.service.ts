import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class AdminConfigService {
    public readonly findPasswordCodeExpiration: string
    public readonly findPasswordTemplateId: string

    constructor(config: SafeConfigService) {
        this.findPasswordCodeExpiration = config.getString('FIND_PASSWORD_CODE_EXPIRATION')
    }
}
