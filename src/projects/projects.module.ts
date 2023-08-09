import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminsModule } from 'src/admins'
import { FileStorageModule } from 'src/file-storage'
import { ReticulumModule } from 'src/reticulum'
import { RoomsModule } from 'src/rooms'
import { ScenesModule } from 'src/scenes'
import { ApiProjectsController } from './api-projects.controller'
import { Project } from './entities'
import { ProjectsController } from './projects.controller'
import { ProjectsRepository } from './projects.repository'
import { ProjectsService } from './projects.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([Project]),
        forwardRef(() => AdminsModule),
        FileStorageModule,
        ReticulumModule,
        ScenesModule,
        RoomsModule
    ],
    controllers: [ProjectsController, ApiProjectsController],
    providers: [ProjectsService, ProjectsRepository],
    exports: [ProjectsService]
})
export class ProjectsModule {}
