export enum PaymentStatus {
    created = 'created',
    completed = 'completed',
    failed = 'failed',
    canceled = 'canceled'
}

export enum WebhookEventType {
    paymentCompleted = 'payment.completed',
    paymentFailed = 'payment.failed',
    paymentCanceled = 'payment.canceled'
}
