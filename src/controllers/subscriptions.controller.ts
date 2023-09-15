import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { SubscriptionsService } from 'src/services/subscriptions/subscriptions.service'
import { TierQueryDto } from 'src/services/tiers/dto'
import { TiersService } from 'src/services/tiers/tiers.service'
import { AdminAuthGuard } from './guards'

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(
        private readonly subscriptionsService: SubscriptionsService,
        private readonly tiersService: TiersService
    ) {}

    @Get('tiers')
    @UseGuards(AdminAuthGuard)
    async findTiers(@Query() queryDto: TierQueryDto) {
        return await this.tiersService.findTiers(queryDto)
    }
}
