export interface CreateCustomerData {
    email: string
    name: string
}

export interface OrderItem {
    productCode: string
    priceCode: string
    currency: string
    minimumQuantity?: number
}

export interface CreateOrderData {
    customerCode: string
    items: OrderItem[]
    paymentGateway?: string
}

export interface RedirectUrls {
    successUrl: string
    errorUrl: string
    cancelUrl: string
}
