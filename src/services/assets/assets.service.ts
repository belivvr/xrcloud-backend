import { Injectable } from '@nestjs/common'
import { extname } from 'path'
import { FileStorage, generateUUID } from 'src/common'
import { PrePathUploadAssetDto } from './dto/prepath-upload-asset.dto'

@Injectable()
export class AssetsService {
    constructor() {}

    async uploadFile(file: Express.Multer.File): Promise<{ fileUrl: string }> {
        const uuid = generateUUID()

        const fileExtension = extname(file.originalname).toLowerCase().slice(1)

        const fileKey = `assets/${uuid.slice(0, 3)}/${uuid}.${fileExtension}`

        const fileUrl = await FileStorage.save(file.buffer, fileKey)

        return { fileUrl }
    }
    
    async uploadFileWithPrePath(prePathUploadAssetDto: PrePathUploadAssetDto, file: Express.Multer.File) {
        const { prePath, key: fileKey } = prePathUploadAssetDto

        const fileUrl = await FileStorage.saveWithPrePath(file.buffer, prePath, fileKey)

        return fileUrl
    }

}
