import { Module } from '@nestjs/common'
import { AzureEmailService } from './email/azure-email.service'
// Temporarily removed the OSS part on September 17, 2024. Consider reusing if Azure OSS is used.
//import { FileStorageConfigService } from './file-storage/file-storage-config.service'
//import { FileStorageService } from './file-storage/file-storage.service'
import { ReticulumConfigService } from './reticulum/reticulum-config.service'
import { ReticulumService } from './reticulum/reticulum.service'
import { SteppayConfigService } from './steppay/steppay-config.service'
import { SteppayService } from './steppay/steppay.service'

@Module({
    providers: [
        AzureEmailService,
        ReticulumService,
        ReticulumConfigService,
        SteppayService,
        SteppayConfigService
    ],
    exports: [AzureEmailService, ReticulumService, SteppayService]
})
export class InfraModule {}
