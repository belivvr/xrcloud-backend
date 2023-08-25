import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminsModule } from 'src/admins/admins.module'
import { ClearModule } from 'src/clear/clear.module'
import { FileStorageModule } from 'src/file-storage/file-storage.module'
import { ReticulumModule } from 'src/reticulum/reticulum.module'
import { ApiProjectsController } from './api-projects.controller'
import { Project } from './entities'
import { ProjectsController } from './projects.controller'
import { ProjectsRepository } from './projects.repository'
import { ProjectsService } from './projects.service'
import { ProjectConfigService } from './services'

@Module({
    imports: [
        TypeOrmModule.forFeature([Project]),
        AdminsModule,
        ReticulumModule,
        FileStorageModule,
        forwardRef(() => ClearModule)
    ],
    controllers: [ProjectsController, ApiProjectsController],
    providers: [ProjectsService, ProjectsRepository, ProjectConfigService],
    exports: [ProjectsService]
})
export class ProjectsModule {}
