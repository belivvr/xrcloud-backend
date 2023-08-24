import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common'
import axios from 'axios'
import { Request, Response } from 'express'
import { FatalException } from '../exceptions'
import { getServerDate } from '../utils'

@Catch(FatalException)
export class FatalExceptionFilter implements ExceptionFilter {
    async catch(error: FatalException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        const message = error.message

        const additionalInfo = {
            method: request.method,
            url: request.url,
            body: request.body
        }

        response.status(500).json({ ...additionalInfo, message: 'Internal Server Error' })

        Logger.error(message, 'HTTP', { ...additionalInfo, stack: error.stack })

        const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL
        const webhookKey = process.env.GOOGLE_CHAT_WEBHOOK_KEY
        const webhookToken = process.env.GOOGLE_CHAT_WEBHOOK_TOKEN

        const googleChatWebhookUrl = `${webhookUrl}?key=${webhookKey}&token=${webhookToken}`

        const chatMessage = {
            cardsV2: [
                {
                    card: {
                        header: {
                            title: 'FatalException Occurred'
                        },
                        sections: [
                            {
                                widgets: [
                                    {
                                        decoratedText: {
                                            topLabel: 'Date',
                                            text: getServerDate()
                                        }
                                    },
                                    {
                                        decoratedText: {
                                            wrapText: true,
                                            topLabel: 'URL',
                                            text: `[${additionalInfo.method}] ${additionalInfo.url}`
                                        }
                                    },
                                    {
                                        decoratedText: {
                                            wrapText: true,
                                            topLabel: 'Body',
                                            text: JSON.stringify(additionalInfo.body)
                                        }
                                    },
                                    {
                                        decoratedText: {
                                            wrapText: true,
                                            topLabel: 'Error Message',
                                            text: message
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
        } catch (err) {
            Logger.error('Failed to send Google Chat Msg', err.message)
        }

        process.exit(1)
    }
}
