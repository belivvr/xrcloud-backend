import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class HealthConfigService {
    public readonly googleChatWebhookKey: string
    public readonly googleChatStatisticsUrl: string
    public readonly googleChatStatisticsToken: string

    constructor(config: SafeConfigService) {
        this.googleChatWebhookKey = config.getString('GOOGLE_CHAT_WEBHOOK_KEY')
        this.googleChatStatisticsUrl = config.getString('GOOGLE_CHAT_STATISTICS_URL')
        this.googleChatStatisticsToken = config.getString('GOOGLE_CHAT_STATISTICS_TOKEN')
    }
}
