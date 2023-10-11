import { AggregateRoot } from 'src/common'
import { Column, Entity } from 'typeorm'
import { OptionRole, OptionValue } from '../types'

@Entity('options')
export class Option extends AggregateRoot {
    @Column()
    role: OptionRole

    @Column({ type: 'json' })
    values: OptionValue

    @Column()
    roomId: string
}
