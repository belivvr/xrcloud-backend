import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from 'src/middleware'
import { AssetsService } from 'src/services/assets/assets.service'
import { PrePathUploadAssetDto } from 'src/services/assets/dto/prepath-upload-asset.dto'


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

    @Post('uploadFileWithPrePath')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFileForCnu(
        @Body() prePathUploadAssetDto: PrePathUploadAssetDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException('File is invalid or not present.')
        }

        return this.assetsService.uploadFileWithPrePath(prePathUploadAssetDto, file)
    }
}
