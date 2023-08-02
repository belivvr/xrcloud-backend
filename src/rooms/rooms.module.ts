import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReticulumModule } from 'src/reticulum'
import { ScenesModule } from 'src/scenes'
import { UsersModule } from 'src/users'
import { Room } from './entities'
import { RoomsRepository } from './rooms.repository'
import { RoomsService } from './rooms.service'

@Module({
    imports: [TypeOrmModule.forFeature([Room]), UsersModule, ReticulumModule, ScenesModule],
    providers: [RoomsService, RoomsRepository],
    exports: [RoomsService]
})
export class RoomsModule {}
