import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository, PaginationResult } from 'src/common'
import { Repository } from 'typeorm'
import { SubscriptionQueryDto } from './dto'
import { Subscription } from './entities'

@Injectable()
export class SubscriptionsRepository extends BaseRepository<Subscription> {
    constructor(@InjectRepository(Subscription) typeorm: Repository<Subscription>) {
        super(typeorm)
    }

    async find(queryDto: SubscriptionQueryDto): Promise<PaginationResult<Subscription>> {
        const { take, skip } = queryDto

        const qb = this.createQueryBuilder(queryDto)

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take, skip }
    }

    async findByAdminId(adminId: string): Promise<Subscription | null> {
        return this.typeorm.findOneBy({ adminId })
    }
}
