import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { GlobalModule } from 'src/global'
import { AdminsModule } from './admins'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { Callbacksmodule } from './callbacks'
import { ProjectsModule } from './projects'
import { ReticulumModule } from './reticulum'
import { RoomsModule } from './rooms'
import { ScenesModule } from './scenes'
import { UsersModule } from './users'

const appModules = [
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'docs'),
        serveRoot: '/docs'
    }),
    GlobalModule,
    AuthModule,
    AdminsModule,
    UsersModule,
    ReticulumModule,
    ProjectsModule,
    ScenesModule,
    RoomsModule,
    Callbacksmodule
]

@Module({
    imports: appModules,
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
