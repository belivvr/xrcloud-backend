const fetch = require('node-fetch')
const fs = require('fs')

require('dotenv').config({ path: '/app/.env' })

const runStatisticsCheck = async () => {
    try {
        const host = process.env.HOST
        
        const statisticsResponse = await fetch(`${host}/health/statistics`)
        const statisticsData = await statisticsResponse.json()

        const countAdmins = statisticsData.admins
        const countScenes = statisticsData.scenes
        const countRooms = statisticsData.rooms
        const countRoomAccesses = statisticsData.roomAccesses

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
                                            topLabel: 'Scenes',
                                            text: `${countScenes}`,
                                        },
                                    },
                                    {
                                        decoratedText: {
                                            topLabel: 'Rooms',
                                            text: `${countRooms}`,
                                        },
                                    },
                                    {
                                        decoratedText: {
                                            topLabel: 'Room Accesses',
                                            text: `${countRoomAccesses}`,
                                        },
                                    },
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

        console.log(fullWebhookUrl)

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
