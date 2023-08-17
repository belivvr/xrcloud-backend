import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { GlobalModule } from 'src/global'
import { AdminsModule } from './admins'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { OutdoorModule } from './outdoor'
import { ProjectsModule } from './projects'
import { ReticulumModule } from './reticulum'
import { RoomsModule } from './rooms'
import { ScenesModule } from './scenes'

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
    OutdoorModule
]

@Module({
    imports: appModules,
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
