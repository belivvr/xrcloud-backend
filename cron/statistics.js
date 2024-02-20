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
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": "0072C6",
            "summary": "XRCLOUD Statistics Summary",
            "sections": [{
                "activityTitle": "XRCLOUD Statistics",
                "activitySubtitle": `${new Date().toISOString().replace('T', ' ').substring(0, 19)} (UTC)`,
                "facts": [
                    {
                        "name": "Date",
                        "value": `${new Date().toISOString().replace('T', ' ').substring(0, 19)} (UTC)`
                    },
                    {
                        "name": "Admins",
                        "value": `${countAdmins}`
                    },
                    {
                        "name": "Scenes",
                        "value": `${countScenes}`
                    },
                    {
                        "name": "Rooms",
                        "value": `${countRooms}`
                    },
                    {
                        "name": "Room Accesses",
                        "value": `${countRoomAccesses}`
                    }
                ],
                "markdown": true
            }]
        }

        const webhookUrl = process.env.TEAMS_WEBHOOK_URL

        const webhookResponse = await fetch(webhookUrl, {
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
