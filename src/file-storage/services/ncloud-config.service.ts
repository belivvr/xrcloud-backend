import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class NcloudConfigService {
    public readonly accessKeyId: string
    public readonly secretAccessKey: string
    public readonly endpoint: string
    public readonly region: string
    public readonly bucket: string

    constructor(config: SafeConfigService) {
        this.accessKeyId = config.getString('NCLOUD_ACCESS_KEY_ID')
        this.secretAccessKey = config.getString('NCLOUD_SECRET_ACCESS_KEY')
        this.endpoint = config.getString('NCLOUD_END_POINT')
        this.region = config.getString('NCLOUD_REGION')
        this.bucket = config.getString('NCLOUD_BUCKET')
    }
}
