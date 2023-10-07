import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { Assert } from 'src/common'
import { CreatePaymentDto } from 'src/services/payments/dto/create-payment.dto'
import { PaymentsService } from 'src/services/payments/payments.service'
import { TiersService } from 'src/services/tiers/tiers.service'
import { HeaderAuthGuard } from './guards'

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly tiersService: TiersService
    ) {}

    @Post('payment')
    @UseGuards(HeaderAuthGuard)
    async createPayment(@Body() createPaymentDto: CreatePaymentDto, @Req() req: any) {
        Assert.defined(req.user, 'Admin authentication failed. req.user is null.')

        await this.tiersService.validateTierExists(createPaymentDto.tierId)

        return await this.paymentsService.createPayment(createPaymentDto, req.user.adminId)
    }
}
