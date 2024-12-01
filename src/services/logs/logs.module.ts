import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomsModule } from 'src/services/rooms/rooms.module'
import { ScenesModule } from 'src/services/scenes/scenes.module'
import { ProjectsModule } from '../projects/projects.module'
import { RoomLogs } from './entities/room-logs.entity'
import { SceneLogsRepository } from './scene-logs.repository'
import { LogsService } from './logs.service'
import { RoomLogsRepository } from './room-logs.repository'
import { SceneLogs } from './entities/scene-logs.entity'
export {LogsService}

@Module({
    imports: [
        ProjectsModule,
        ScenesModule,
        RoomsModule,
        TypeOrmModule.forFeature([RoomLogs, RoomLogsRepository]),
        TypeOrmModule.forFeature([SceneLogs, SceneLogsRepository])
    ],
    providers: [LogsService, RoomLogsRepository, SceneLogsRepository],
    exports: [LogsService]
})
export class LogsModule {}
