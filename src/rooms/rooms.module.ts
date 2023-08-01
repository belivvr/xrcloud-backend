import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectsModule } from 'src/projects'
import { ReticulumModule } from 'src/reticulum'
import { ScenesModule } from 'src/scenes'
import { UsersModule } from 'src/users'
import { Room } from './entities'
import { RoomsController } from './rooms.controller'
import { RoomsRepository } from './rooms.repository'
import { RoomsService } from './rooms.service'

@Module({
    imports: [TypeOrmModule.forFeature([Room]), UsersModule, ProjectsModule, ReticulumModule, ScenesModule],
    controllers: [RoomsController],
    providers: [RoomsService, RoomsRepository],
    exports: [RoomsService]
})
export class RoomsModule {}
