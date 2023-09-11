import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class SubsConfigService {
    public readonly starterTierProductCode: string
    public readonly starterTierPriceCode: string

    constructor(config: SafeConfigService) {
        this.starterTierProductCode = config.getString('STARTER_TIER_PRODUCT_CODE')
        this.starterTierPriceCode = config.getString('STARTER_TIER_PRICE_CODE')
    }
}
