import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { GlobalModule } from 'src/global'
import { AdminsModule } from './admins/admins.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { ClearModule } from './clear/clear.module'
import { HealthModule } from './health/health.module'
import { OutdoorModule } from './outdoor/outdoor.module'
import { ProjectsModule } from './projects/projects.module'
import { ReticulumModule } from './reticulum/reticulum.module'
import { RoomsModule } from './rooms/rooms.module'
import { ScenesModule } from './scenes/scenes.module'

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
    AuthModule,
    AdminsModule,
    ReticulumModule,
    ProjectsModule,
    ScenesModule,
    RoomsModule,
    OutdoorModule,
    ClearModule,
    HealthModule
]

@Module({
    imports: appModules,
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
