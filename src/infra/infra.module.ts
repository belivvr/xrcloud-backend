import { Module } from '@nestjs/common'
import { MailgunModule } from 'nestjs-mailgun'
import { SafeConfigService } from 'src/common'
import { EmailConfigService } from './email/email-config.service'
import { EmailService } from './email/email.service'
import { FileStorageConfigService } from './file-storage/file-storage-config.service'
import { FileStorageService } from './file-storage/file-storage.service'
import { ReticulumConfigService } from './reticulum/reticulum-config.service'
import { ReticulumService } from './reticulum/reticulum.service'
import { SteppayConfigService } from './steppay/steppay-config.service'
import { SteppayService } from './steppay/steppay.service'

@Module({
    imports: [
        MailgunModule.forAsyncRoot({
            useFactory: async (configService: SafeConfigService) => {
                const config = new EmailConfigService(configService)

                return {
                    username: config.mailgunUserName,
                    key: config.mailgunApiKey
                }
            },
            inject: [SafeConfigService]
        })
    ],
    providers: [
        EmailService,
        EmailConfigService,
        FileStorageService,
        FileStorageConfigService,
        ReticulumService,
        ReticulumConfigService,
        SteppayService,
        SteppayConfigService
    ],
    exports: [EmailService, FileStorageService, ReticulumService, SteppayService]
})
export class InfraModule {}
