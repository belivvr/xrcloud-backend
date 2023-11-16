import { AggregateRoot } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('users')
export class User extends AggregateRoot {
    @Column()
    projectId: string

    @Column()
    infraUserId: string

    @Column()
    reticulumId: string
}
