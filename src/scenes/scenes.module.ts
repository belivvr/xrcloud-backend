import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectsModule } from 'src/projects'
import { ReticulumModule } from 'src/reticulum'
import { UsersModule } from 'src/users'
import { Scene } from './entities'
import { ScenesController } from './scenes.controller'
import { ScenesRepository } from './scenes.repository'
import { ScenesService } from './scenes.service'

@Module({
    imports: [TypeOrmModule.forFeature([Scene]), UsersModule, ProjectsModule, ReticulumModule],
    controllers: [ScenesController],
    providers: [ScenesService, ScenesRepository],
    exports: [ScenesService]
})
export class ScenesModule {}
