import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository, PaginationResult } from 'src/common'
import { Repository } from 'typeorm'
import { QueryDto } from './dto'
import { Room } from './entities'

@Injectable()
export class RoomsRepository extends BaseRepository<Room> {
    constructor(@InjectRepository(Room) typeorm: Repository<Room>) {
        super(typeorm)
    }

    async findAll(queryDto: QueryDto): Promise<PaginationResult<Room>> {
        const qb = this.createQueryBuilder(queryDto)

        qb.where('entity.sceneId = :sceneId', { sceneId: queryDto.sceneId })

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take: queryDto.take, skip: queryDto.skip }
    }

    async countByProjectId(projectId: string): Promise<number> {
        const qb = this.typeorm.createQueryBuilder('rooms')

        qb.where('rooms.projectId = :projectId', { projectId })

        const count = await qb.getCount()

        return count
    }
}
