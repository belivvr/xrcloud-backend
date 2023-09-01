const fetch = require('node-fetch');
const fs = require('fs');

require('dotenv').config({ path: '/.env' });

const runHealthCheck = async () => {
    try {
        const host = process.env.HOST

        const response = await fetch(`${host}/health`);
        const data = await response.json();
        
        const dbStatus = data.database.status;
        const diskUsage = data.resources.disk;

        if (dbStatus) {
            return;
        }
        
        const chatMessage = {
            cardsV2: [
                {
                    card: {
                        header: {
                            title: 'Health Check',
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
        };
        
        const postResponse = await fetch('https://chat.googleapis.com/v1/spaces/AAAAbNlsse8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=ZBg5GO48UE6g89uphMzOEtsBpLem5z01gnenNOCOTbQ', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatMessage),
        });
        
        if (postResponse.ok) {
            await fs.promises.appendFile('/var/log/health.log', `${new Date()} - POST request sent\n`);
        } else {
            await fs.promises.appendFile('/var/log/health.log', `${new Date()} - Failed to send POST request: ${postResponse.status}\n`);
        }

    } catch (error) {
        await fs.promises.appendFile('/var/log/health.log', `${new Date()} - Error: ${error}\n`);
    }
};

runHealthCheck();
