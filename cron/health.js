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
            return
        }
        
        const chatMessage = {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": "0076D7",
            "summary": "Health Check Summary",
            "sections": [
                {
                    "activityTitle": `Health Check: ${env}`,
                    "activitySubtitle": `${new Date().toISOString().replace('T', ' ').substring(0, 19)} (UTC)`,
                    "facts": [
                        {
                            "name": "Database Status",
                            "value": `${dbStatus}`
                        },
                        {
                            "name": "Disk Usage",
                            "value": `${diskUsagePersent}`
                        },
                        {
                            "name": "CPU Usage",
                            "value": `${cpuUsagePersent}`
                        }
                    ],
                    "markdown": true
                }
            ]
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
            await fs.promises.appendFile('/var/log/health.log', `${new Date()} - POST request sent\n`)
        } else {
            await fs.promises.appendFile('/var/log/health.log', `${new Date()} - Failed to send POST request: ${webhookResponse.status}\n`)
        }
    } catch (error) {
        await fs.promises.appendFile('/var/log/health.log', `${new Date()} - Error: ${error}\n`)
    }
}

runHealthCheck()
