import { BaseEntity } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('order_account')
export class OrderAccount extends BaseEntity {
    @Column()
    accountId: number

    @Column()
    accountCode: string

    @Column()
    adminId: string
}
