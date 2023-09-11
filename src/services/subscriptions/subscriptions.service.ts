import { Injectable, NotFoundException } from '@nestjs/common'
import { Assert, updateIntersection } from 'src/common'
import { SteppayService } from 'src/infra/steppay/steppay.service'
import { AdminsService } from 'src/services/admins/admins.service'
import { CreateSubsPaymentDto, CreateSubsTierDto, HandleWebhookDto, QueryDto } from './dto'
import { SubsPayment, SubsTier } from './entities'
import { PaymentData } from './interfaces'
import { SubsConfigService } from './subs-config-service'
import { SubsPaymentRepository } from './subs-payment.repository'
import { SubsTierRepository } from './subs-tier.repository'
import { PaymentStatus, WebhookEventType } from './types'

const STARTER_TIER_ID = 1

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly subsTierRepository: SubsTierRepository,
        private readonly subsPaymentRepository: SubsPaymentRepository,
        private readonly configService: SubsConfigService,
        private readonly adminsService: AdminsService,
        private readonly steppayService: SteppayService
    ) {}

    /*
     * tier
     */
    async createTier(createTierDto: CreateSubsTierDto) {
        const { productCode, priceCode, ...data } = createTierDto

        const createSubsTier = {
            productCode: productCode || this.configService.starterTierProductCode,
            priceCode: priceCode || this.configService.starterTierPriceCode,
            ...data
        }

        return await this.subsTierRepository.create(createSubsTier)
    }

    async findTiers(queryDto: QueryDto) {
        return await this.subsTierRepository.find(queryDto)
    }

    async getTier(subsTierId: number): Promise<SubsTier> {
        const subsTier = await this.subsTierRepository.findById(subsTierId)

        Assert.defined(subsTier, `Scene with ID "${subsTierId}" not found.`)

        return subsTier as SubsTier
    }

    async getStarterTierId(): Promise<number> {
        const starterTierId = await this.subsTierRepository.getStarterTierId()

        return starterTierId || STARTER_TIER_ID
    }

    async findTierByPriceCode(priceCode: string): Promise<SubsTier> {
        const subsTier = await this.subsTierRepository.findByPriceCode(priceCode)

        if (!subsTier) {
            throw new NotFoundException(`Subscription tier with orderpriceCodeId "${priceCode}" not found.`)
        }

        return subsTier
    }

    async tierExists(subsTierId: number): Promise<boolean> {
        return this.subsTierRepository.exist(subsTierId)
    }

    async validateTierExists(subsTierId: number) {
        const subsTierExists = await this.tierExists(subsTierId)

        if (!subsTierExists) {
            throw new NotFoundException(`Subscription tier with ID "${subsTierId}" not found.`)
        }
    }

    /*
     * payment
     */
    async createPayment(createPaymentDto: CreateSubsPaymentDto, adminId: string) {
        const { subsTierId, ...urls } = createPaymentDto

        const orderAccount = await this.adminsService.findOrderAccountByAdminId(adminId)

        let customerCode

        if (!orderAccount) {
            const admin = await this.adminsService.getAdmin(adminId)

            const createCustomer = {
                email: admin.email,
                name: admin.name
            }

            const { id: accountId, code: accountCode } = await this.steppayService.createCustomer(
                createCustomer
            )

            const createPaymentAccount = {
                accountId,
                accountCode,
                adminId
            }

            const createdPaymentAccount = await this.adminsService.createOrderAccount(createPaymentAccount)

            customerCode = createdPaymentAccount.accountCode
        } else {
            customerCode = orderAccount.accountCode
        }

        const subsTier = await this.getTier(subsTierId)

        const orderItem = {
            productCode: subsTier.productCode,
            priceCode: subsTier.priceCode,
            currency: subsTier.currency,
            minimumQuantity: 1
        }

        const createOrder = {
            customerCode,
            items: [orderItem]
        }

        const { orderId, orderCode } = await this.steppayService.createOrder(createOrder)

        const createPayment = {
            orderId,
            orderCode,
            adminId,
            subsTierId: subsTier.id
        }

        await this.subsPaymentRepository.create(createPayment)

        return await this.steppayService.getOrderLink(orderCode, urls)
    }

    async paymentExistsByOrderId(orderId: number): Promise<boolean> {
        return this.subsPaymentRepository.existsByOrderId(orderId)
    }

    async findPaymentByOrderId(orderId: number): Promise<SubsPayment> {
        const subsPayment = await this.subsPaymentRepository.findByOrderId(orderId)

        if (!subsPayment) {
            throw new NotFoundException(`Subscription payment with orderId "${orderId}" not found.`)
        }

        return subsPayment
    }

    /*
     * webhook
     */
    async handleWebhook(handleWebhookDto: HandleWebhookDto) {
        const { event, data } = handleWebhookDto

        const { orderId: _orderId } = data as PaymentData

        const orderId = Number(_orderId)

        const paymentExists = await this.paymentExistsByOrderId(orderId)

        switch (event) {
            case WebhookEventType.paymentCompleted: {
                const { customerId: _customerId } = data as PaymentData

                const accountId = Number(_customerId)

                const orderAccount = await this.adminsService.findOrderAccountByAccountId(accountId)

                if (paymentExists) {
                    const subsPayment = await this.findPaymentByOrderId(orderId)

                    const updateSubsPayment = {
                        status: PaymentStatus.completed
                    }

                    const updatedSubsPayment = updateIntersection(subsPayment, updateSubsPayment)

                    await this.subsPaymentRepository.update(updatedSubsPayment)

                    await this.adminsService.adminExists(orderAccount.adminId)

                    const updateAdmin = {
                        subsTierId: subsPayment.subsTierId
                    }

                    await this.adminsService.updateAdmin(orderAccount.adminId, updateAdmin)
                }

                break
            }

            case WebhookEventType.paymentFailed: {
                if (paymentExists) {
                    const subsPayment = await this.findPaymentByOrderId(orderId)

                    const updateSubsPayment = {
                        status: PaymentStatus.failed
                    }

                    const updatedSubsPayment = updateIntersection(subsPayment, updateSubsPayment)

                    const savedSubsPayment = await this.subsPaymentRepository.update(updatedSubsPayment)

                    Assert.deepEquals(
                        savedSubsPayment,
                        updatedSubsPayment,
                        'The result is different from the update request'
                    )
                }

                break
            }

            case WebhookEventType.paymentCanceled: {
                if (paymentExists) {
                    const subsPayment = await this.findPaymentByOrderId(orderId)

                    const updateSubsPayment = {
                        status: PaymentStatus.canceled
                    }

                    const updatedSubsPayment = updateIntersection(subsPayment, updateSubsPayment)

                    const savedSubsPayment = await this.subsPaymentRepository.update(updatedSubsPayment)

                    Assert.deepEquals(
                        savedSubsPayment,
                        updatedSubsPayment,
                        'The result is different from the update request'
                    )
                }

                break
            }

            default: {
                return
            }
        }
    }
}
