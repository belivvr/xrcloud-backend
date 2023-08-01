import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository, PaginationResult } from 'src/common'
import { Repository } from 'typeorm'
import { QueryDto } from './dto'
import { Project } from './entities'

@Injectable()
export class ProjectsRepository extends BaseRepository<Project> {
    constructor(@InjectRepository(Project) typeorm: Repository<Project>) {
        super(typeorm)
    }

    async findAll(queryDto: QueryDto, adminId: string): Promise<PaginationResult<Project>> {
        const qb = this.createQueryBuilder(queryDto)

        qb.where('entity.adminId = :adminId', {
            adminId: adminId
        })

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take: queryDto.take, skip: queryDto.skip }
    }

    async findByAdminId(adminId: string): Promise<Project | null> {
        return await this.typeorm.findOneBy({ adminId: adminId })
    }
}
