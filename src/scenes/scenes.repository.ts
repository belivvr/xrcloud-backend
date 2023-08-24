import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository, PaginationResult } from 'src/common'
import { FindOptionsWhere, Repository } from 'typeorm'
import { QueryDto } from './dto'
import { Scene } from './entities'

@Injectable()
export class ScenesRepository extends BaseRepository<Scene> {
    constructor(@InjectRepository(Scene) typeorm: Repository<Scene>) {
        super(typeorm)
    }

    async find(projectId: string, queryDto: QueryDto): Promise<PaginationResult<Scene>> {
        const { take, skip } = queryDto

        const qb = this.createQueryBuilder(queryDto)

        qb.where('entity.projectId = :projectId', { projectId })

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take, skip }
    }

    async findByInfraUserId(infraSceneId: string): Promise<Scene | null> {
        return this.typeorm.findOneBy({ infraSceneId })
    }

    async sceneExists(infraSceneId: string): Promise<boolean> {
        return this.typeorm.exist({
            where: { infraSceneId: infraSceneId } as FindOptionsWhere<Scene>
        })
    }
}
