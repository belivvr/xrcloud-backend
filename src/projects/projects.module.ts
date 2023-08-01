import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FileStorageModule } from 'src/file-storage'
import { Project } from './entities'
import { ProjectsController } from './projects.controller'
import { ProjectsRepository } from './projects.repository'
import { ProjectsService } from './projects.service'

@Module({
    imports: [TypeOrmModule.forFeature([Project]), FileStorageModule],
    controllers: [ProjectsController],
    providers: [ProjectsService, ProjectsRepository],
    exports: [ProjectsService]
})
export class ProjectsModule {}
