import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { SteppayConfigService } from '.'
import { CreateCustomerData, CreateOrderData, RedirectUrls } from '../interfaces'

const HTTP_SUCCESS_UPPER_BOUND = 300
const STEPPAY_ERROR_MESSAGE = 'Steppay: Failed to'

@Injectable()
export class SteppayService {
    private readonly steppaySecretKey: string
    private readonly steppayApiUrl: string

    constructor(private readonly configService: SteppayConfigService) {
        this.steppaySecretKey = this.configService.steppaySecretKey
        this.steppayApiUrl = this.configService.steppayApiUrl
    }

    private async request(apiUrl: string, options?: any) {
        const response = await fetch(`${this.steppayApiUrl}/api/v1/${apiUrl}`, options)

        if (response.status >= HTTP_SUCCESS_UPPER_BOUND) {
            throw new HttpException(
                `HTTP request failed with status code ${response.status}`,
                response.status
            )
        }

        return response
    }

    private getHeaders(withBody = false): any {
        const headers: any = {
            accept: '*/*',
            'Secret-Token': this.steppaySecretKey
        }

        if (withBody) {
            headers['Content-Type'] = 'application/json'
        }

        return headers
    }

    async createCustomer(createCustomerData: CreateCustomerData) {
        const response = await this.request('customers', {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(createCustomerData)
        })

        const responseData = await response.json()

        if (!responseData?.id || !responseData?.code) {
            throw new InternalServerErrorException(`${STEPPAY_ERROR_MESSAGE} create customer`)
        }

        return responseData
    }

    async createOrder(createOrderData: CreateOrderData) {
        if (!createOrderData.paymentGateway) {
            createOrderData.paymentGateway = 'NICE'
        }

        const response = await this.request('orders', {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(createOrderData)
        })

        const responseData = await response.json()

        if (!responseData?.orderCode || typeof responseData.orderCode !== 'string') {
            throw new InternalServerErrorException(`${STEPPAY_ERROR_MESSAGE} create order`)
        }

        return responseData
    }

    async getOrder(orderId: number) {
        const response = await this.request(`orders/${orderId}`, {
            method: 'GET',
            headers: this.getHeaders()
        })

        const responseData = await response.json()

        if (!responseData?.items || responseData?.items.length === 0) {
            throw new InternalServerErrorException(`${STEPPAY_ERROR_MESSAGE} get order`)
        }

        return responseData
    }

    async getOrderLink(orderCode: string, redirectUrls: RedirectUrls) {
        const { successUrl, errorUrl, cancelUrl } = redirectUrls

        const orderLink = `${this.steppayApiUrl}/api/public/orders/${orderCode}/pay`

        const fullOrderLink = `${orderLink}?successUrl=${successUrl}&errorUrl=${errorUrl}&cancelUrl=${cancelUrl}`

        return fullOrderLink
    }
}
