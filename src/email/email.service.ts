import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { MailgunService } from 'nestjs-mailgun'
import { EmailConfigService } from './services'

@Injectable()
export class EmailService {
    constructor(
        private readonly mailgunService: MailgunService,
        private readonly configService: EmailConfigService
    ) {}

    async createEmail(to: string, subject: string, sendEmailData: object) {
        const domain = this.configService.mailgunDomain
        const fromEmail = this.configService.mailgunFromEmail

        try {
            const data = {
                from: fromEmail,
                to: to,
                subject: subject,
                template: 'xrcloud-backend',
                'h:X-Mailgun-Variables': JSON.stringify(sendEmailData)
            }

            this.mailgunService.createEmail(domain, data)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
