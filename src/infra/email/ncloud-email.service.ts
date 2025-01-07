import { Injectable, Logger } from '@nestjs/common'
import { createHmac } from 'crypto'
import fetch from 'node-fetch'
import { NCloudEmailConfigService } from './ncloud-email-config.service'

// this code is used for NCloud Mailer, default setting is azureMailer, this code is not used (2025-01-06)

@Injectable()
export class NCloudEmailService {
    private readonly accessKeyId: string
    private readonly secretAccessKey: string
    private readonly endpoint: string

    constructor(private readonly configService: NCloudEmailConfigService) {
        this.accessKeyId = this.configService.accessKeyId
        this.secretAccessKey = this.configService.secretAccessKey
        this.endpoint = this.configService.endpoint
    }

    async sendEmail(to: string, templateId: string, parameters: object) {
        const timestamp = Date.now().toString()

        const signature = this.makeSignature('POST', '/api/v1/mails', timestamp)

        const headers = {
            'Content-Type': 'application/json',
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-iam-access-key': this.accessKeyId,
            'x-ncp-apigw-signature-v2': signature
        }

        const recipient = {
            address: to,
            type: 'R'
        }

        const data = {
            templateSid: templateId,
            parameters: parameters,
            recipients: [recipient]
        }

        try {
            const response = await fetch(`${this.endpoint}/mails`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const errorData = await response.text()

                Logger.error('Failed to mailing', errorData)

                throw new Error(`Failed with status ${response.status}`)
            }
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
