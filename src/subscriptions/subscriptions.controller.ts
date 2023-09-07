import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import { AdminAuthGuard } from 'src/auth/guards'
import { Assert } from 'src/common'
import { CreateSubsPaymentDto, CreateSubsTierDto, QueryDto } from './dto'
import { HandleWebhookDto } from './dto/handle-webhook.dto'
import { SubscriptionsService } from './subscriptions.service'

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    /*
     * subscriptions tier
     */
    @Post('tier')
    @UseGuards(AdminAuthGuard)
    async createTier(@Body() createTierDto: CreateSubsTierDto) {
        return await this.subscriptionsService.createTier(createTierDto)
    }

    @Get('tier')
    @UseGuards(AdminAuthGuard)
    async findTiers(@Query() queryDto: QueryDto) {
        return await this.subscriptionsService.findTiers(queryDto)
    }

    /*
     * subscriptions payment
     */
    @Post('payment')
    @UseGuards(AdminAuthGuard)
    async createPayment(@Body() createPaymentDto: CreateSubsPaymentDto, @Req() req: any) {
        Assert.defined(req.user, 'Admin authentication failed. req.user is null.')

        await this.subscriptionsService.validateTierExists(createPaymentDto.subsTierId)

        return await this.subscriptionsService.createPayment(createPaymentDto, req.user.adminId)
    }

    @Post('webhook')
    async handleWebhook(@Body() webhookDto: HandleWebhookDto) {
        await this.subscriptionsService.handleWebhook(webhookDto)
    }
}
