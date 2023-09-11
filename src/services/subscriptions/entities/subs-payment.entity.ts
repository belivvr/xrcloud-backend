import { BaseEntity } from 'src/common'
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm'
import { PaymentStatus } from '../types'

@Entity('subs_payment')
export class SubsPayment extends BaseEntity {
    @Column()
    orderId: number

    @Column()
    orderCode: string

    @Column({ default: PaymentStatus.created })
    status: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column()
    adminId: string

    @Column()
    subsTierId: number
}
