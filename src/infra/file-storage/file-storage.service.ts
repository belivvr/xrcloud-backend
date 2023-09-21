import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { FileStorageConfigService } from './file-storage-config.service'

@Injectable()
export class FileStorageService {
    private s3: S3

    private readonly cdnPath: string
    private readonly storage: string
    private readonly bucket: string

    constructor(private readonly configService: FileStorageConfigService) {
        this.s3 = new S3({
            endpoint: configService.endpoint,
            region: configService.region,
            credentials: {
                accessKeyId: configService.accessKeyId,
                secretAccessKey: configService.secretAccessKey
            }
        })

        this.cdnPath = this.configService.cdnPath
        this.bucket = this.configService.bucket
        this.storage = `${this.cdnPath}/${this.bucket}`
    }

    async saveFile(file: Buffer, key: string | undefined) {
        if (!key) {
            throw new InternalServerErrorException('Key for uploading files is required.')
        }

        try {
            const uploadParams: S3.PutObjectRequest = {
                Bucket: this.configService.bucket,
                Key: `${key}`,
                Body: file,
                ACL: 'public-read'
            }

            return await this.s3.upload(uploadParams).promise()
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    getFileUrl(fileId: string, fileType: string) {
        const prePath = fileId.slice(0, 3)

        return `${this.storage}/${fileType}/${prePath}/${fileId}`
    }

    async removeFile(key: string | undefined) {
        if (!key) {
            throw new InternalServerErrorException('Key for deleting files is required.')
        }

        try {
            const deleteParams: S3.DeleteObjectRequest = {
                Bucket: this.configService.bucket,
                Key: key
            }

            await this.s3.deleteObject(deleteParams).promise()
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}
