import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectsModule } from 'src/projects'
import { RoomsModule } from 'src/rooms'
import { ScenesModule } from 'src/scenes'
import { AdminsController } from './admins.controller'
import { AdminsRepository } from './admins.repository'
import { AdminsService } from './admins.service'
import { Admin } from './entities'

@Module({
    imports: [TypeOrmModule.forFeature([Admin]), ProjectsModule, ScenesModule, RoomsModule],
    controllers: [AdminsController],
    providers: [AdminsService, AdminsRepository],
    exports: [AdminsService]
})
export class AdminsModule {}
