import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { NestFactory } from '@nestjs/core'
import { AppLoggerService, isDevelopment, isProduction } from 'src/common'
import { AppModule } from './app.module'
import * as express from 'express'

// config({ path: '.env.development' }); // .env.development 파일을 로드합니다.

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const config = new DocumentBuilder()
        .setTitle('NestJS Example')
        .setDescription('NestJS 데모 프로젝트')
        .setVersion('1.0')
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    if (process.env.HTTP_REQUEST_PAYLOAD_LIMIT) {
        const limit = process.env.HTTP_REQUEST_PAYLOAD_LIMIT

        app.use(express.json({ limit }))
        app.use(express.urlencoded({ limit, extended: true }))
    }

    const logger = app.get(AppLoggerService)
    app.useLogger(logger)

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
