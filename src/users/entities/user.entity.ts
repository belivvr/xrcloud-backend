import { AggregateRoot } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('users')
export class User extends AggregateRoot {
    @Column()
    personalId: string

    @Column()
    infraUserId: string

    @Column()
    projectId: string
}
