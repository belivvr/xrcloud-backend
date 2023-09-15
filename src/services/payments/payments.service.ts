import { Injectable } from '@nestjs/common'
import { TiersService } from '../tiers/tiers.service'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { PaymentRepository } from './payments.repository'

@Injectable()
export class PaymentsService {
    constructor(
        private readonly paymentsRepository: PaymentRepository,
        private readonly tiersService: TiersService
    ) {}

    async createPayment(createPaymentDto: CreatePaymentDto, adminId: string) {
        const { tierId, ...urls } = createPaymentDto

        // const orderAccount = await this.adminsService.findOrderAccountByAdminId(adminId)

        // let customerCode

        // if (!orderAccount) {
        //     const admin = await this.adminsService.getAdmin(adminId)

        //     const createCustomer = {
        //         email: admin.email,
        //         name: admin.name
        //     }

        //     const { id: accountId, code: accountCode } = await this.steppayService.createCustomer(
        //         createCustomer
        //     )

        //     const createPaymentAccount = {
        //         accountId,
        //         accountCode,
        //         adminId
        //     }

        //     const createdPaymentAccount = await this.adminsService.createOrderAccount(createPaymentAccount)

        //     customerCode = createdPaymentAccount.accountCode
        // } else {
        //     customerCode = orderAccount.accountCode
        // }

        const tier = await this.tiersService.getTier(tierId)

        // const orderItem = {
        //     productCode: tier.productCode,
        //     priceCode: tier.priceCode,
        //     currency: tier.currency,
        //     minimumQuantity: 1
        // }

        // const createOrder = {
        //     customerCode,
        //     items: [orderItem]
        // }

        // const { orderId, orderCode } = await this.steppayService.createOrder(createOrder)

        // const createPayment = {
        //     orderId,
        //     orderCode,
        //     adminId,
        //     subsTierId: tier.id
        // }

        // await this.paymentsRepository.create(createPayment)

        // return await this.steppayService.getOrderLink(orderCode, urls)
    }
}
