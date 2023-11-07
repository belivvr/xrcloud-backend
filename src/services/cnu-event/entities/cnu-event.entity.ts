import { AggregateRoot } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('cnu_event')
export class CnuEvent extends AggregateRoot {
    @Column({ unique: true })
    userId: string

    @Column()
    projectId: string

    @Column()
    sceneId: string

    @Column({ nullable: true })
    roomId: string
}
