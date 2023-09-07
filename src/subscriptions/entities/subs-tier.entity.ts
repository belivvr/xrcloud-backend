import { BaseEntity } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('subs_tier')
export class SubsTier extends BaseEntity {
    @Column()
    productCode: string

    @Column()
    priceCode: string

    @Column()
    name: string

    @Column()
    currency: string

    @Column()
    price: string
}
