const fetch = require('node-fetch')
const fs = require('fs')

const runHealthCheck = async () => {
    try {
        const host = 'https://vevv-test.vevv.io:3300'

        const healthResponse = await fetch(`${host}/health`)
        const healthResponseData = await healthResponse.json()
        
        const dbStatus = healthResponseData.database.status
        const diskUsage = healthResponseData.resources.disk

        if (dbStatus) {
            return
        }
        
        const chatMessage = {
            cardsV2: [
                {
                    card: {
                        header: {
                            title: 'Health Check(STAGE)',
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
                                            text: `${diskUsage}`,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        }

        const webhookUrl = 'https://chat.googleapis.com/v1/spaces/AAAAbNlsse8/messages'
        const webhookKey = 'AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI'
        const webhookToken = 'ZBg5GO48UE6g89uphMzOEtsBpLem5z01gnenNOCOTbQ'

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
