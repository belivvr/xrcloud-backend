import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { GlobalModule } from 'src/global'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ControllersModule } from './controllers/controllers.module'

const appModules = [
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'docs/api/en'),
        serveRoot: '/docs/en'
    }),
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'docs/api/ko'),
        serveRoot: '/docs/ko'
    }),
    GlobalModule,
    ControllersModule
]

@Module({
    imports: appModules,
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
