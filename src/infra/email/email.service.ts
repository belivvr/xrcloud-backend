import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { MailgunService } from 'nestjs-mailgun'
import { EmailConfigService } from './email-config.service'

@Injectable()
export class EmailService {
    private readonly domain: string
    private readonly fromEmail: string

    constructor(
        private readonly mailgunService: MailgunService,
        private readonly configService: EmailConfigService
    ) {
        this.domain = this.configService.mailgunDomain
        this.fromEmail = this.configService.mailgunFromEmail
    }

    async createEmail(to: string, subject: string, sendEmailData: object) {
        try {
            const data = {
                from: this.fromEmail,
                to: to,
                subject: subject,
                template: 'xrcloud-backend',
                'h:X-Mailgun-Variables': JSON.stringify(sendEmailData)
            }

            this.mailgunService.createEmail(this.domain, data)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
