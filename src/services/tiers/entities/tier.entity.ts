import { AggregateRoot } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('tiers')
export class Tier extends AggregateRoot {
    @Column()
    name: string

    @Column()
    description: string

    @Column()
    currency: string

    @Column()
    price: string

    @Column({ default: false })
    isDefault: boolean

    @Column()
    maxStorage: string

    @Column()
    maxRooms: number

    @Column()
    maxRoomSize: number
}
