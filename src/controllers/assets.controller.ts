import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from 'src/middleware'
import { AssetsService } from 'src/services/assets/assets.service'

@Controller('assets')
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file', { fileFilter: multerOptions.assetFilter }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is invalid or not present.')
        }

        return this.assetsService.uploadFile(file)
    }
}
