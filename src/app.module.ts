import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { GlobalModule } from 'src/global'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ControllersModule } from './controllers/controllers.module'
import { InfraModule } from './infra/infra.module'
import { AdminsModule } from './services/admins/admins.module'
import { AuthModule } from './services/auth/auth.module'
import { ClearModule } from './services/clear/clear.module'
import { EventsModule } from './services/events/events.module'
import { HealthModule } from './services/health/health.module'
import { OutdoorModule } from './services/outdoor/outdoor.module'
import { ProjectsModule } from './services/projects/projects.module'
import { RoomsModule } from './services/rooms/rooms.module'
import { ScenesModule } from './services/scenes/scenes.module'
import { SubscriptionsModule } from './services/subscriptions/subscriptions.module'

const appModules = [
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'docs/en'),
        serveRoot: '/docs/en'
    }),
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'docs/ko'),
        serveRoot: '/docs/ko'
    }),
    GlobalModule,
    ControllersModule,
    AuthModule,
    AdminsModule,
    ProjectsModule,
    ScenesModule,
    RoomsModule,
    OutdoorModule,
    ClearModule,
    HealthModule,
    EventsModule,
    SubscriptionsModule,
    InfraModule
]

@Module({
    imports: appModules,
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
