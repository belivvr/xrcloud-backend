import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { SubscriptionsService } from 'src/services/subscriptions/subscriptions.service'
import { TiersQueryDto } from 'src/services/tiers/dto'
import { TiersService } from 'src/services/tiers/tiers.service'
import { HeaderAuthGuard } from './guards'

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(
        private readonly subscriptionsService: SubscriptionsService,
        private readonly tiersService: TiersService
    ) {}

    @Get('tiers')
    @UseGuards(HeaderAuthGuard)
    async findTiers(@Query() queryDto: TiersQueryDto) {
        return await this.tiersService.findTiers(queryDto)
    }
}
