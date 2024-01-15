const fetch = require('node-fetch')
const fs = require('fs')

require('dotenv').config({ path: '/app/.env' })

const runHealthCheck = async () => {
    try {
        const env = process.env.NODE_ENV || ''
        const host = process.env.HOST

        const healthResponse = await fetch(`${host}/health`)
        const healthResponseData = await healthResponse.json()
        
        const dbStatus = healthResponseData.database.status
        const diskUsagePersent = healthResponseData.resources.disk
        const cpuUsagePersent = healthResponseData.resources.cpu

        const diskUsage = parseInt(diskUsagePersent.replace('%', ''), 10)
        const cpuUsage = parseInt(cpuUsagePersent.replace('%', ''), 10)

        const diskThreshold = 70
        const cpuThreshold = 70

        if (dbStatus && diskUsage < diskThreshold && cpuUsage < cpuThreshold) {
            return;
        }
        
        const chatMessage = {
            cardsV2: [
                {
                    card: {
                        header: {
                            title: `Health Check: ${env}`,
                        },
                        sections: [
                            {
                                widgets: [
                                    {
                                        decoratedText: {
                                            topLabel: 'Date',
                                            text: `${new Date().toISOString().replace('T', ' ').substring(0, 19)} (UTC)`,
                                        },
                                    },
                                    {
                                        decoratedText: {
                                            topLabel: 'Database Status',
                                            text: `${dbStatus}`,
                                        },
                                    },
                                    {
                                        decoratedText: {
                                            topLabel: 'Disk Usage',
                                            text: `${diskUsagePersent}`,
                                        },
                                    },
                                    {
                                        decoratedText: {
                                            topLabel: 'CPU Usage',
                                            text: `${cpuUsagePersent}`,
                                        },
                                    }
                                ],
                            },
                        ],
                    },
                },
            ],
        }

        const webhookUrl = process.env.GOOGLE_CHAT_MONITORING_URL
        const webhookKey = process.env.GOOGLE_CHAT_WEBHOOK_KEY
        const webhookToken = process.env.GOOGLE_CHAT_MONITORING_TOKEN

        const fullWebhookUrl = `${webhookUrl}?key=${webhookKey}&token=${webhookToken}`
        
        const webhookResponse = await fetch(fullWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatMessage),
        })
        
        if (webhookResponse.ok) {
            await fs.promises.appendFile('/var/log/health.log', `${new Date()} - POST request sent\n`)
        } else {
            await fs.promises.appendFile('/var/log/health.log', `${new Date()} - Failed to send POST request: ${webhookResponse.status}\n`)
        }
    } catch (error) {
        await fs.promises.appendFile('/var/log/health.log', `${new Date()} - Error: ${error}\n`)
    }
}

runHealthCheck()
