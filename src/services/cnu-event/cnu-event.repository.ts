/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository } from 'src/common'
import { Repository } from 'typeorm'
import { CnuEvent } from './entities'

@Injectable()
export class CnuEventRepository extends BaseRepository<CnuEvent> {
    constructor(@InjectRepository(CnuEvent) typeorm: Repository<CnuEvent>) {
        super(typeorm)
    }

    async findByCreator(creator: string): Promise<CnuEvent | null> {
        const qb = this.createQueryBuilder()
            .where('entity.creator = :creator', { creator })

        return qb.getOne()
    }
}
