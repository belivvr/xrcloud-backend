import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class FileStorageConfigService {
    public readonly cdnPath: string
    public readonly accessKeyId: string
    public readonly secretAccessKey: string
    public readonly endpoint: string
    public readonly region: string
    public readonly bucket: string

    // Currently not using ncloud(s3), so the settings have been removed from .env. Kept for future use if bucket usage is needed (2025-01-05)
    constructor(config: SafeConfigService) {
        this.cdnPath = config.getString('CDN_PATH')
        this.accessKeyId = config.getString('NCLOUD_ACCESS_KEY_ID')
        this.secretAccessKey = config.getString('NCLOUD_SECRET_ACCESS_KEY')
        this.endpoint = config.getString('NCLOUD_STORAGE_END_POINT')
        this.region = config.getString('NCLOUD_STORAGE_REGION')
        this.bucket = config.getString('NCLOUD_STORAGE_BUCKET')
    }
}
