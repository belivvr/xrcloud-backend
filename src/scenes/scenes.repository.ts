import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository, PaginationResult } from 'src/common'
import { FindOptionsWhere, Repository } from 'typeorm'
import { SceneQueryDto } from './dto'
import { Scene } from './entities'

@Injectable()
export class ScenesRepository extends BaseRepository<Scene> {
    constructor(@InjectRepository(Scene) typeorm: Repository<Scene>) {
        super(typeorm)
    }

    async find(sceneQueryDto: SceneQueryDto): Promise<PaginationResult<Scene>> {
        const { projectId, take, skip } = sceneQueryDto

        const qb = this.createQueryBuilder(sceneQueryDto)
            .where('entity.projectId = :projectId', { projectId })

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take, skip }
    }

    async findByInfraSceneId(infraSceneId: string): Promise<Scene | null> {
        return this.typeorm.findOneBy({ infraSceneId })
    }

    async findByProjectId(projectId: string): Promise<Scene[]> {
        const qb = this.createQueryBuilder()
            .where('entity.projectId = :projectId', { projectId })

        return await qb.getMany()
    }

    async sceneExists(infraSceneId: string): Promise<boolean> {
        return this.typeorm.exist({
            where: { infraSceneId: infraSceneId } as FindOptionsWhere<Scene>
        })
    }
}
