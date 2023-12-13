import { Injectable, Logger } from '@nestjs/common'
import { createHmac } from 'crypto'
import fetch from 'node-fetch'
import { EmailConfigService } from './email-config.service'

@Injectable()
export class EmailService {
    private readonly accessKeyId: string
    private readonly secretAccessKey: string
    private readonly endpoint: string
    private readonly sender: string

    constructor(private readonly configService: EmailConfigService) {
        this.accessKeyId = this.configService.accessKeyId
        this.secretAccessKey = this.configService.secretAccessKey
        this.endpoint = this.configService.endpoint
        this.sender = this.configService.sender
    }

    async sendEmailWithTemplate(to: string, templateId: string, parameters: object) {
        const recipient = {
            address: to,
            type: 'R'
        }

        const data = {
            templateSid: templateId,
            parameters: parameters,
            recipients: [recipient]
        }

        await this.sendEmail(data)
    }

    async sendEmailWithoutTemplate(to: string, title: string, sendEmailData: object) {
        const recipient = {
            address: to,
            type: 'R'
        }

        const data = {
            senderAddress: this.sender,
            title: title,
            body: JSON.stringify(sendEmailData),
            recipients: [recipient]
        }

        await this.sendEmail(data)
    }

    private async sendEmail(sendMailData: object) {
        const timestamp = Date.now().toString()

        const signature = this.makeSignature('POST', '/api/v1/mails', timestamp)

        const headers = {
            'Content-Type': 'application/json',
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-iam-access-key': this.accessKeyId,
            'x-ncp-apigw-signature-v2': signature
        }

        try {
            const response = await fetch(`${this.endpoint}/mails`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(sendMailData)
            })

            if (!response.ok) {
                const errorData = await response.text()

                Logger.error('Failed to mailing', errorData)

                throw new Error(`Failed with status ${response.status}`)
            }

            return response.json()
        } catch (error) {
            throw error
        }
    }

    private makeSignature(method: string, uri: string, timestamp: string): string {
        const space = ' '
        const newLine = '\n'

        const message = [method, space, uri, newLine, timestamp, newLine, this.accessKeyId].join('')

        const hmac = createHmac('sha256', this.secretAccessKey)
        const signature = hmac.update(message).digest('base64')

        return signature
    }
}
