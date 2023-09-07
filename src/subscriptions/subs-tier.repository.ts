import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseEntityRepository, PaginationResult } from 'src/common'
import { Repository } from 'typeorm'
import { QueryDto } from './dto'
import { SubsTier } from './entities'
import { SubsConfigService } from './services'

@Injectable()
export class SubsTierRepository extends BaseEntityRepository<SubsTier> {
    constructor(
        @InjectRepository(SubsTier) typeorm: Repository<SubsTier>,
        private readonly configService: SubsConfigService
    ) {
        super(typeorm)
    }

    async find(queryDto: QueryDto): Promise<PaginationResult<SubsTier>> {
        const { take, skip } = queryDto

        const qb = this.createQueryBuilder(queryDto)

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take, skip }
    }

    async findByPriceCode(priceCode: string): Promise<SubsTier | null> {
        return this.typeorm.findOneBy({ priceCode })
    }

    async getStarterTierId(): Promise<number | null> {
        const starterTierPriceCode = this.configService.starterTierPriceCode

        const starterTier = await this.typeorm.findOneBy({ priceCode: starterTierPriceCode })

        return starterTier ? starterTier.id : null
    }
}
