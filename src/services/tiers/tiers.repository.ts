import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository, PaginationResult } from 'src/common'
import { Repository } from 'typeorm'
import { TiersQueryDto } from './dto'
import { Tier } from './entities'

@Injectable()
export class TiersRepository extends BaseRepository<Tier> {
    constructor(@InjectRepository(Tier) typeorm: Repository<Tier>) {
        super(typeorm)
    }

    async find(queryDto: TiersQueryDto): Promise<PaginationResult<Tier>> {
        const { take, skip } = queryDto

        const qb = this.createQueryBuilder(queryDto)

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take, skip }
    }

    async getDefaultTier(): Promise<Tier | null> {
        return this.typeorm.findOneBy({ isDefault: true })
    }
}
