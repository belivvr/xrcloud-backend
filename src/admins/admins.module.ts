import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Admin } from './entities'
import { AdminsService } from './admins.service'
import { AdminsRepository } from './admins.repository'
import { AdminsController } from './admins.controller'
import { ScenesModule } from 'src/scenes'
import { AuthModule } from 'src/auth'
import { RoomsModule } from 'src/rooms'
import { ProjectsModule } from 'src/projects'

@Module({
    imports: [TypeOrmModule.forFeature([Admin]), AuthModule, ProjectsModule, ScenesModule, RoomsModule],
    controllers: [AdminsController],
    providers: [AdminsService, AdminsRepository],
    exports: [AdminsService]
})
export class AdminsModule {}
