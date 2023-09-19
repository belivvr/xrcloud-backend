import { AggregateRoot } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('scenes')
export class Scene extends AggregateRoot {
    @Column()
    name: string

    @Column()
    infraProjectId: string

    @Column()
    infraSceneId: string

    @Column()
    thumbnailId: string

    @Column({ default: false })
    isPublicRoomOnCreate: boolean

    @Column()
    projectId: string
}
