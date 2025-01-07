import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { AzureEmailService } from 'src/infra/email/azure-email.service'
import { FatalException } from '../exceptions'
import { getServerDate } from '../utils'

@Catch(FatalException)
export class FatalExceptionFilter implements ExceptionFilter {
    constructor(private readonly emailService: AzureEmailService) {}

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

        // google chat notification
        const webhookKey = process.env.GOOGLE_CHAT_WEBHOOK_KEY
        const webhookUrl = process.env.GOOGLE_CHAT_MONITORING_URL
        const webhookToken = process.env.GOOGLE_CHAT_MONITORING_TOKEN

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
                                            text: `${getServerDate()} (UTC)`
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
            await fetch(googleChatWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(chatMessage)
            })
        } catch (error) {
            Logger.error('Failed to send Google Chat Msg', error.message)
        }

        // email notification
        const to = 'dev_team@belivvr.com'
        const templateId = AzureEmailService.Template.FATAL_EXCEPTION

        const sendEmailData = {
            date: getServerDate(),
            url: `[${additionalInfo.method}] ${additionalInfo.url}`,
            body: JSON.stringify(additionalInfo.body),
            msg: message
        }

        try {
            await this.emailService.sendEmailWithAzure(to, templateId, sendEmailData)
        } catch (error) {
            Logger.error('Failed to send Google Mail', error.message)
        }

        process.exit(1)
    }
}
