import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FileStorageModule } from 'src/file-storage'
import { ProjectsModule } from 'src/projects'
import { ReticulumModule } from 'src/reticulum'
import { ScenesModule } from 'src/scenes'
import { Room } from './entities'
import { RoomsRepository } from './rooms.repository'
import { RoomsService } from './rooms.service'
import { RoomConfigService } from './services'

@Module({
    imports: [
        TypeOrmModule.forFeature([Room]),
        ReticulumModule,
        ScenesModule,
        FileStorageModule,
        forwardRef(() => ProjectsModule)
    ],
    providers: [RoomsService, RoomsRepository, RoomConfigService],
    exports: [RoomsService]
})
export class RoomsModule {}
