import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminsModule } from 'src/services/admins/admins.module'
import { Project } from './entities'
import { ProjectsRepository } from './projects.repository'
import { ProjectsService } from './projects.service'

@Module({
    imports: [TypeOrmModule.forFeature([Project]), AdminsModule],
    providers: [ProjectsService, ProjectsRepository],
    exports: [ProjectsService]
})
export class ProjectsModule {}
