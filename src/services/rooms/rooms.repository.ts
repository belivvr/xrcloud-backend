import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository, PaginationResult } from 'src/common'
import { Repository } from 'typeorm'
import { RoomsQueryDto } from './dto'
import { Room } from './entities'

@Injectable()
export class RoomsRepository extends BaseRepository<Room> {
    constructor(@InjectRepository(Room) typeorm: Repository<Room>) {
        super(typeorm)
    }

    async find(queryDto: RoomsQueryDto): Promise<PaginationResult<Room>> {
        const { take, skip } = queryDto

        const qb = this.createQueryBuilder(queryDto)

        if (queryDto.projectId) {
            qb.where('entity.projectId = :projectId', { projectId: queryDto.projectId })
        } else {
            qb.where('entity.sceneId = :sceneId', { sceneId: queryDto.sceneId })
        }

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take, skip }
    }

    async findBySceneId(sceneId: string): Promise<Room[]> {
        const qb = this.createQueryBuilder()
            .where('entity.sceneId = :sceneId', { sceneId })

        return qb.getMany()
    }

    async findByInfraRoomId(infraRoomId: string): Promise<Room | null> {
        return this.typeorm.findOneBy({ infraRoomId })
    }

    async count(): Promise<number> {
        return this.typeorm.count()
    }

    async countByProjectId(projectId: string): Promise<number> {
        const qb = this.createQueryBuilder()
            .where('entity.projectId = :projectId', { projectId })

        return qb.getCount()
    }
}
