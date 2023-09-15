import { AggregateRoot } from 'src/common'
import { Column, Entity } from 'typeorm'
import { SubscriptionStatus } from '../types'

@Entity('subscriptions')
export class Subscription extends AggregateRoot {
    @Column()
    status: SubscriptionStatus

    @Column()
    startAt: Date

    @Column()
    endAt: Date

    @Column()
    adminId: string

    @Column()
    tierId: string
}

// subs 변경에 대한 update funcs
