/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository, PaginationResult } from 'src/common'
import { Repository } from 'typeorm'
import { ProjectsQueryDto } from './dto'
import { Project } from './entities'

@Injectable()
export class ProjectsRepository extends BaseRepository<Project> {
    constructor(@InjectRepository(Project) typeorm: Repository<Project>) {
        super(typeorm)
    }

    async find(queryDto: ProjectsQueryDto, adminId: string): Promise<PaginationResult<Project>> {
        const { take, skip } = queryDto

        const qb = this.createQueryBuilder(queryDto)
            .where('entity.adminId = :adminId', { adminId })

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take, skip }
    }

    async findByAdminId(adminId: string): Promise<Project[]> {
        const qb = this.createQueryBuilder()
            .where('entity.adminId = :adminId', { adminId })

        return qb.getMany()
    }

    async findByLabel(label: string): Promise<Project | null> {
        const qb = this.createQueryBuilder()
            .where('entity.label = :label', { label })

        return qb.getOne()
    }

    async findByAdminIdAndLabel(adminId: string, label: string): Promise<Project | null> {
        const qb = this.createQueryBuilder()
            .where('entity.label = :label', { label })
            .andWhere('entity.adminId = :adminId', { adminId })

        return qb.getOne()
    }
}
