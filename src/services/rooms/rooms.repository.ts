import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository, PaginationResult } from 'src/common'
import { Repository } from 'typeorm'
import { RoomQueryDto } from './dto'
import { Room } from './entities'

@Injectable()
export class RoomsRepository extends BaseRepository<Room> {
    constructor(@InjectRepository(Room) typeorm: Repository<Room>) {
        super(typeorm)
    }

    async find(queryDto: RoomQueryDto): Promise<PaginationResult<Room>> {
        const { sceneId, take, skip } = queryDto

        const qb = this.createQueryBuilder(queryDto)
            .where('entity.sceneId = :sceneId', { sceneId })

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
