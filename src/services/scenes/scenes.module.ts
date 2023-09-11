import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InfraModule } from 'src/infra/infra.module'
import { AdminsModule } from 'src/services/admins/admins.module'
import { ProjectsModule } from 'src/services/projects/projects.module'
import { Scene } from './entities'
import { SceneConfigService } from './scene-config.service'
import { ScenesRepository } from './scenes.repository'
import { ScenesService } from './scenes.service'

@Module({
    imports: [TypeOrmModule.forFeature([Scene]), InfraModule, AdminsModule, ProjectsModule],
    providers: [ScenesService, ScenesRepository, SceneConfigService],
    exports: [ScenesService]
})
export class ScenesModule {}
