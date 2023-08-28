import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { AdminsService } from 'src/admins/admins.service'
import { RoomsService } from 'src/rooms/rooms.service'
import { HealthConfigService } from './services'
import { getServerDate } from 'src/common'

@Injectable()
export class HealthService {
    constructor(
        private readonly adminsService: AdminsService,
        private readonly roomsService: RoomsService,
        private readonly configService: HealthConfigService
    ) {}

    async getStatistics() {
        const countAdmins = await this.adminsService.count()
        const countRooms = await this.roomsService.count()

        // google chat notification
        const webhookKey = this.configService.googleChatWebhookKey
        const webhookUrl = this.configService.googleChatStatisticsUrl
        const webhookToken = this.configService.googleChatStatisticsToken

        const googleChatWebhookUrl = `${webhookUrl}?key=${webhookKey}&token=${webhookToken}`

        const chatMessage = {
            cardsV2: [
                {
                    card: {
                        header: {
                            title: 'XRCLOUD Statistics'
                        },
                        sections: [
                            {
                                widgets: [
                                    {
                                        decoratedText: {
                                            topLabel: 'Date',
                                            text: `${getServerDate()} (UTC)`
                                        }
                                    },
                                    {
                                        decoratedText: {
                                            topLabel: 'Admins',
                                            text: `${countAdmins}`
                                        }
                                    },
                                    {
                                        decoratedText: {
                                            topLabel: 'Rooms',
                                            text: `${countRooms}`
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }

        try {
            await axios.post(googleChatWebhookUrl, chatMessage)
        } catch (error) {
            Logger.error('Failed to send Google Chat Msg', error.message)
        }
    }
}
