import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InfraModule } from 'src/infra/infra.module'
import { AdminsModule } from 'src/services/admins/admins.module'
import { ScenesModule } from 'src/services/scenes/scenes.module'
import { OptionsModule } from '../options/options.module'
import { UsersModule } from '../users/users.module'
import { Room, RoomAccess } from './entities'
import { RoomAccessRepository } from './room-access.repository'
import { RoomConfigService } from './room-config.service'
import { RoomsRepository } from './rooms.repository'
import { RoomsService } from './rooms.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([Room, RoomAccess]),
        AdminsModule,
        InfraModule,
        ScenesModule,
        OptionsModule,
        UsersModule
    ],
    providers: [RoomsService, RoomsRepository, RoomConfigService, RoomAccessRepository],
    exports: [RoomsService]
})
export class RoomsModule {}
