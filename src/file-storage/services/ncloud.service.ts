import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { NcloudConfigService } from './ncloud-config.service'

@Injectable()
export class NcloudService {
    private s3: S3

    constructor(private readonly ncloudConfig: NcloudConfigService) {
        this.s3 = new S3({
            endpoint: ncloudConfig.endpoint,
            region: ncloudConfig.region,
            credentials: {
                accessKeyId: ncloudConfig.accessKeyId,
                secretAccessKey: ncloudConfig.secretAccessKey
            }
        })
    }

    async upload(file: Buffer, key: string) {
        try {
            const uploadParams: S3.PutObjectRequest = {
                Bucket: this.ncloudConfig.bucket,
                Key: `${key}`,
                Body: file,
                ACL: 'public-read'
            }

            const result = await this.s3.upload(uploadParams).promise()

            return result
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async delete(key: string) {
        try {
            const deleteParams: S3.DeleteObjectRequest = {
                Bucket: this.ncloudConfig.bucket,
                Key: key
            }

            await this.s3.deleteObject(deleteParams).promise()
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}
