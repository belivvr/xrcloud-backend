import { Module } from '@nestjs/common'
import { FileStorageService } from './file-storage.service'
import { NcloudConfigService, NcloudService } from './services'

@Module({
    providers: [FileStorageService, NcloudConfigService, NcloudService],
    exports: [FileStorageService]
})
export class FileStorageModule {}
