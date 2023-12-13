import { NestFactory } from '@nestjs/core'
import * as express from 'express'
import { AppLoggerService, isDevelopment, isProduction } from 'src/common'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        rawBody: true
    })

    if (process.env.HTTP_REQUEST_PAYLOAD_LIMIT) {
        const limit = process.env.HTTP_REQUEST_PAYLOAD_LIMIT

        app.use(express.json({ limit }))
        app.use(express.urlencoded({ limit, extended: true }))
    }

    const logger = app.get(AppLoggerService)
    app.useLogger(logger)

    app.enableCors()

    const port = process.env.PORT ?? 3000

    await app.listen(port)

    console.log(`Application is running on: ${await app.getUrl()}`)
}

if (isDevelopment() || isProduction()) {
    bootstrap()
} else {
    console.error('NODE_ENV is not set. Exiting...')
    process.exit(1)
}
