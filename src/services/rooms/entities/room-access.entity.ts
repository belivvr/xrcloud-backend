import { BaseEntity } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('room_access')
export class RoomAccess extends BaseEntity {
    @Column()
    roomId: string

    @Column()
    infraUserId: string

    @Column()
    sessionId: string

    @Column()
    joinedAt: Date

    @Column({ nullable: true })
    exitedAt: Date
}
