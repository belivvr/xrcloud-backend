import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReticulumModule } from 'src/reticulum'
import { Scene } from './entities'
import { ScenesRepository } from './scenes.repository'
import { ScenesService } from './scenes.service'

@Module({
    imports: [TypeOrmModule.forFeature([Scene]), ReticulumModule],
    providers: [ScenesService, ScenesRepository],
    exports: [ScenesService]
})
export class ScenesModule {}
