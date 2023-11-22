/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository, PaginationResult } from 'src/common'
import { FindOptionsWhere, Repository } from 'typeorm'
import { ScenesQueryDto } from './dto'
import { Scene } from './entities'

@Injectable()
export class ScenesRepository extends BaseRepository<Scene> {
    constructor(@InjectRepository(Scene) typeorm: Repository<Scene>) {
        super(typeorm)
    }

    async find(queryDto: ScenesQueryDto): Promise<PaginationResult<Scene>> {
        const { projectId, take, skip } = queryDto

        const qb = this.createQueryBuilder(queryDto)
            .where('entity.projectId = :projectId', { projectId })

        if (queryDto.name) {
            qb.where('entity.name LIKE :name', {
                name: `%${queryDto.name}%`
            })
        }

        if (queryDto.creator) {
            qb.andWhere('entity.creator = :creator', { creator: queryDto.creator })
        }

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take, skip }
    }

    async findByInfraSceneId(infraSceneId: string): Promise<Scene | null> {
        return this.typeorm.findOneBy({ infraSceneId })
    }

    async findByProjectId(projectId: string): Promise<Scene[]> {
        const qb = this.createQueryBuilder()
            .where('entity.projectId = :projectId', { projectId })

        return qb.getMany()
    }

    async sceneExists(infraSceneId: string): Promise<boolean> {
        return this.typeorm.exist({
            where: { infraSceneId: infraSceneId } as FindOptionsWhere<Scene>
        })
    }
}
