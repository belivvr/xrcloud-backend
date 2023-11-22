/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository } from 'src/common'
import { Repository } from 'typeorm'
import { Option } from './entities'
import { OptionRole } from './types'

@Injectable()
export class OptionsRepository extends BaseRepository<Option> {
    constructor(@InjectRepository(Option) typeorm: Repository<Option>) {
        super(typeorm)
    }

    async findByRoomId(roomId: string): Promise<Option[]> {
        const qb = this.createQueryBuilder()
            .where('entity.roomId = :roomId', { roomId: roomId })

        return qb.getMany()
    }

    async findHostOptionByRoomId(roomId: string): Promise<Option | null> {
        const qb = this.createQueryBuilder()
            .where('entity.roomId = :roomId', { roomId: roomId })
            .andWhere('entity.role = :role', { role: OptionRole.Host })

        return qb.getOne()
    }

    async findGuestOptionByRoomId(roomId: string): Promise<Option | null> {
        const qb = this.createQueryBuilder()
            .where('entity.roomId = :roomId', { roomId: roomId })
            .andWhere('entity.role = :role', { role: OptionRole.Guest })

        return qb.getOne()
    }
}
