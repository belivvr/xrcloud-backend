import { AggregateRoot } from 'src/common'
import { Column, Entity } from 'typeorm'
import { PaymentMethod, PaymentStatus } from '../types'

// histories, logs, transactions
@Entity('payment-history')
export class Payment extends AggregateRoot {
    @Column()
    status: PaymentStatus

    // extra
    @Column()
    method: PaymentMethod

    @Column()
    adminId: string

    @Column()
    tierId: string
}
