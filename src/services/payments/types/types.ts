export enum PaymentStatus {
    created = 'created',
    completed = 'completed',
    failed = 'failed',
    canceled = 'canceled'
}

export enum PaymentMethod {
    card = 'card',
    kakaopay = 'kakaopay'
}

// export enum WebhookEventType {
//     paymentCompleted = 'payment.completed',
//     paymentFailed = 'payment.failed',
//     paymentCanceled = 'payment.canceled'
// }
