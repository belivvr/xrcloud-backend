import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InfraModule } from 'src/infra/infra.module'
import { AdminsModule } from 'src/services/admins/admins.module'
import { ScenesModule } from 'src/services/scenes/scenes.module'
import { OptionsModule } from '../options/options.module'
import { UsersModule } from '../users/users.module'
import { Room } from './entities'
import { RoomLogs } from '../logs/entities/room-logs.entity'
import { RoomLogsRepository } from '../logs/room-logs.repository'
import { RoomConfigService } from './room-config.service'
import { RoomsRepository } from './rooms.repository'
import { RoomsService } from './rooms.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([Room, RoomLogs]),
        AdminsModule,
        InfraModule,
        ScenesModule,
        OptionsModule,
        UsersModule
    ],
    providers: [
        RoomsService,
        RoomsRepository,
        RoomConfigService,
        RoomLogsRepository,        
    ],
    exports: [RoomsService]
})
export class RoomsModule {}
