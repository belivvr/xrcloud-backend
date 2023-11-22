import { AggregateRoot } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('rooms')
export class Room extends AggregateRoot {
    @Column()
    name: string

    @Column()
    slug: string

    @Column()
    size: number

    @Column({ default: 'tag' })
    tag: string

    @Column()
    infraRoomId: string

    @Column()
    thumbnailId: string

    @Column({ nullable: true })
    returnUrl: string

    @Column()
    projectId: string

    @Column()
    sceneId: string
}
