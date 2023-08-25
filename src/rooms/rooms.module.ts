import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminsModule } from 'src/admins/admins.module'
import { ClearModule } from 'src/clear/clear.module'
import { FileStorageModule } from 'src/file-storage/file-storage.module'
import { ReticulumModule } from 'src/reticulum/reticulum.module'
import { ScenesModule } from 'src/scenes/scenes.module'
import { ApiRoomsController } from './api-rooms.controller'
import { Room } from './entities'
import { RoomsController } from './rooms.controller'
import { RoomsRepository } from './rooms.repository'
import { RoomsService } from './rooms.service'
import { RoomConfigService } from './services'

@Module({
    imports: [
        TypeOrmModule.forFeature([Room]),
        AdminsModule,
        ReticulumModule,
        FileStorageModule,
        ScenesModule,
        forwardRef(() => ClearModule)
    ],
    controllers: [RoomsController, ApiRoomsController],
    providers: [RoomsController, RoomsService, RoomsRepository, RoomConfigService],
    exports: [RoomsService]
})
export class RoomsModule {}
