import { Module } from '@nestjs/common'
import { MailgunModule } from 'nestjs-mailgun'
import { SafeConfigService } from 'src/common'
import { EmailService } from './email.service'
import { EmailConfigService } from './services'

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
    providers: [EmailService, EmailConfigService],
    exports: [EmailService]
})
export class EmailModule {}
