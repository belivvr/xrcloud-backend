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

    @Column()
    infraRoomId: string

    @Column()
    thumbnailId: string

    @Column({ default: false })
    isPublic: boolean

    @Column()
    projectId: string

    @Column()
    sceneId: string
}
