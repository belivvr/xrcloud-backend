import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InfraModule } from 'src/infra/infra.module'
import { AdminsModule } from 'src/services/admins/admins.module'
import { Project } from './entities'
import { ProjectConfigService } from './project-config.service'
import { ProjectsRepository } from './projects.repository'
import { ProjectsService } from './projects.service'

@Module({
    imports: [TypeOrmModule.forFeature([Project]), AdminsModule, InfraModule],
    providers: [ProjectsService, ProjectsRepository, ProjectConfigService],
    exports: [ProjectsService]
})
export class ProjectsModule {}
