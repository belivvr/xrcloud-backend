import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { NcloudService } from './services'

@Injectable()
export class FileStorageService {
    private readonly env: string
    private readonly host: string
    private readonly storage: string

    constructor(private readonly ncloudService: NcloudService) {
        this.env = process.env.ENV || 'dev'
        this.host = process.env.CDN_PATH || 'https://kr.object.ncloudstorage.com'

        if (this.env === 'dev') {
            this.storage = `${this.host}/loool-${this.env}`
        } else {
            this.storage = `${this.host}/xrcloud-prod-backend`
        }
    }

    async save(file: Buffer, key: string | undefined) {
        if (!key) {
            throw new InternalServerErrorException('Key for deleting files is required.')
        }

        return await this.ncloudService.upload(file, key)
    }

    getFileUrl(fileId: string, fileType: string) {
        const prePath = fileId.slice(0, 3)

        return `${this.storage}/${fileType}/${prePath}/${fileId}`
    }

    async remove(key: string | undefined) {
        if (!key) {
            throw new InternalServerErrorException('Key for deleting files is required.')
        }

        return await this.ncloudService.delete(key)
    }
}
