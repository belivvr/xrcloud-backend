import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReticulumModule } from 'src/reticulum'
import { ScenesModule } from 'src/scenes'
import { Room } from './entities'
import { RoomsRepository } from './rooms.repository'
import { RoomsService } from './rooms.service'
import { RoomConfigService } from './services'

@Module({
    imports: [TypeOrmModule.forFeature([Room]), ReticulumModule, ScenesModule],
    providers: [RoomsService, RoomsRepository, RoomConfigService],
    exports: [RoomsService]
})
export class RoomsModule {}
