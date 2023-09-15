import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InfraModule } from 'src/infra/infra.module'
import { AdminsModule } from 'src/services/admins/admins.module'
import { ScenesModule } from 'src/services/scenes/scenes.module'
import { Room } from './entities'
import { RoomConfigService } from './room-config.service'
import { RoomsRepository } from './rooms.repository'
import { RoomsService } from './rooms.service'

@Module({
    imports: [TypeOrmModule.forFeature([Room]), AdminsModule, InfraModule, ScenesModule],
    providers: [RoomsService, RoomsRepository, RoomConfigService],
    exports: [RoomsService]
})
export class RoomsModule {}
