import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminsModule } from 'src/admins/admins.module'
import { ClearModule } from 'src/clear/clear.module'
import { ProjectsModule } from 'src/projects/projects.module'
import { ReticulumModule } from 'src/reticulum/reticulum.module'
import { ApiScenesController } from './api-scenes.controller'
import { Scene } from './entities'
import { ScenesController } from './scenes.controller'
import { ScenesRepository } from './scenes.repository'
import { ScenesService } from './scenes.service'
import { SceneConfigService } from './services/scene-config.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([Scene]),
        AdminsModule,
        ReticulumModule,
        ProjectsModule,
        forwardRef(() => ClearModule)
    ],
    controllers: [ScenesController, ApiScenesController],
    providers: [ScenesService, ScenesRepository, SceneConfigService],
    exports: [ScenesService]
})
export class ScenesModule {}
