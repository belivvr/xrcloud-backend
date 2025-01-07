import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

// this code is used for NCloud Mailer, default setting is azureMailer, this code is not used (2025-01-06)
@Injectable()
export class NCloudEmailConfigService {
    public readonly accessKeyId: string
    public readonly secretAccessKey: string
    public readonly endpoint: string
    public readonly sender: string
    

    constructor(config: SafeConfigService) {
        this.accessKeyId = config.getString('NCLOUD_ACCESS_KEY_ID')
        this.secretAccessKey = config.getString('NCLOUD_SECRET_ACCESS_KEY')
        this.endpoint = config.getString('NCLOUD_MAILER_END_POINT')
        this.sender = config.getString('NCLOUD_MAILER_SENDER_ADDRESS')
    }
}
