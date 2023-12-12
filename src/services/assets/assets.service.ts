import { Injectable } from '@nestjs/common'
import { extname } from 'path'
import { generateUUID } from 'src/common'
import { FileStorageService } from 'src/infra/file-storage/file-storage.service'

@Injectable()
export class AssetsService {
    constructor(private readonly fileStorageService: FileStorageService) {}

    async uploadFile(file: Express.Multer.File) {
        const uuid = generateUUID()

        const fileExtension = extname(file.originalname).toLowerCase().slice(1)

        const fileKey = `assets/${uuid.slice(0, 3)}/${uuid}.${fileExtension}`

        const result = await this.fileStorageService.saveFile(file.buffer, fileKey, file.mimetype)

        const fileUrl = result.Location

        return { fileUrl }
    }
}
