import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class ReticulumConfigService {
    public readonly host: string
    public readonly apiHost: string
    public readonly adminId: string

    constructor(config: SafeConfigService) {
        this.host = config.getString('HOST')
        this.apiHost = config.getString('RETICULUM_HOST')
        this.adminId = config.getString('RETICULUM_ADMIN_ID')
    }
}
