import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseEntityRepository, PaginationResult } from 'src/common'
import { FindOptionsWhere, Repository } from 'typeorm'
import { QueryDto } from './dto'
import { SubsPayment } from './entities'

@Injectable()
export class SubsPaymentRepository extends BaseEntityRepository<SubsPayment> {
    constructor(@InjectRepository(SubsPayment) typeorm: Repository<SubsPayment>) {
        super(typeorm)
    }

    async find(queryDto: QueryDto): Promise<PaginationResult<SubsPayment>> {
        const { take, skip } = queryDto

        const qb = this.createQueryBuilder(queryDto)

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take, skip }
    }

    async findByOrderId(orderId: number): Promise<SubsPayment | null> {
        return this.typeorm.findOneBy({ orderId })
    }

    async existsByOrderId(orderId: number): Promise<boolean> {
        return this.typeorm.exist({
            where: { orderId: orderId } as FindOptionsWhere<SubsPayment>
        })
    }
}
