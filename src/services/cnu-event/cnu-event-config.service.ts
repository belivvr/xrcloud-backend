import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class CnuEventConfigService {
    public readonly cnuAdminEmail: string

    constructor(config: SafeConfigService) {
        this.cnuAdminEmail = config.getString('CNU_ADMIN_EMAIL')
    }
}
