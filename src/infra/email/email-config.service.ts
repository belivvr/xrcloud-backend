import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class EmailConfigService {
    public readonly mailgunUserName: string
    public readonly mailgunApiKey: string
    public readonly mailgunDomain: string
    public readonly mailgunFromEmail: string
    public readonly mailgunFromname: string

    constructor(config: SafeConfigService) {
        this.mailgunUserName = config.getString('MAILGUN_USERNAME')
        this.mailgunApiKey = config.getString('MAILGUN_API_KEY')
        this.mailgunDomain = config.getString('MAILGUN_DOMAIN')
        this.mailgunFromEmail = config.getString('MAILGUN_FROM_EMAIL')
        this.mailgunFromname = config.getString('MAILGUN_FROM_NAME')
    }
}
