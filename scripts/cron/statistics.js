const fetch = require('node-fetch')
const fs = require('fs')

const runStatisticsCheck = async () => {
    try {
        const host = 'https://vevv-test.vevv.io:3300'
        
        const statisticsResponse = await fetch(`${host}/health/statistics`)
        const statisticsData = await statisticsResponse.json()

        const countAdmins = statisticsData.admins
        const countRooms = statisticsData.rooms

        const chatMessage = {
            cardsV2: [
                {
                    card: {
                        header: {
                            title: 'XRCLOUD Statistics',
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
                                            topLabel: 'Admins',
                                            text: `${countAdmins}`,
                                        },
                                    },
                                    {
                                        decoratedText: {
                                            topLabel: 'Rooms',
                                            text: `${countRooms}`,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        }

        const webhookUrl = 'https://chat.googleapis.com/v1/spaces/AAAAtJIrHow/messages'
        const webhookKey = 'AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI'
        const webhookToken = 'gh_9nPs-6MZCBb1acOXou5y52ffUPJAqbiLliHx7xAw'

        const fullWebhookUrl = `${webhookUrl}?key=${webhookKey}&token=${webhookToken}`

        const webhookResponse = await fetch(fullWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatMessage),
        })

        if (webhookResponse.ok) {
            await fs.promises.appendFile('/var/log/statistics.log', `${new Date()} - POST request sent\n`)
        } else {
            await fs.promises.appendFile('/var/log/statistics.log', `${new Date()} - Failed to send POST request: ${webhookResponse.status}\n`)
        }
    } catch (error) {
        await fs.promises.appendFile('/var/log/statistics.log', `${new Date()} - Error: ${error}\n`)
    }
}

runStatisticsCheck()
