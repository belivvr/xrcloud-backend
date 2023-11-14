/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseEntityRepository } from 'src/common'
import { Repository } from 'typeorm'
import { RoomAccessQueryDto } from './dto'
import { RoomAccess } from './entities'

@Injectable()
export class RoomAccessRepository extends BaseEntityRepository<RoomAccess> {
    constructor(@InjectRepository(RoomAccess) typeorm: Repository<RoomAccess>) {
        super(typeorm)
    }

    async findByRoomId(roomId: string, queryDto: RoomAccessQueryDto): Promise<RoomAccess[]> {
        const qb = this.createQueryBuilder()
            .where('entity.roomId = :roomId', { roomId })

        if (queryDto.userId) {
            qb.andWhere('entity.infraUserId = :infraUserId', { infraUserId: queryDto.userId })
        }

        return qb.getMany()
    }

    async findBySessionId(sessionId: string): Promise<RoomAccess | null> {
        return this.typeorm.findOneBy({ sessionId })
    }
}
