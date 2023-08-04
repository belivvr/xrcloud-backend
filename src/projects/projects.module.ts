import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FileStorageModule } from 'src/file-storage'
import { RoomsModule } from 'src/rooms'
import { ScenesModule } from 'src/scenes'
import { UsersModule } from 'src/users'
import { ApiProjectsController } from './api-projects.controller'
import { Project } from './entities'
import { ProjectsController } from './projects.controller'
import { ProjectsRepository } from './projects.repository'
import { ProjectsService } from './projects.service'
import { AdminsModule } from 'src/admins'

@Module({
    imports: [
        TypeOrmModule.forFeature([Project]),
        forwardRef(() => AdminsModule),
        FileStorageModule,
        UsersModule,
        ScenesModule,
        RoomsModule
    ],
    controllers: [ProjectsController, ApiProjectsController],
    providers: [ProjectsService, ProjectsRepository],
    exports: [ProjectsService]
})
export class ProjectsModule {}
