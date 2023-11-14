import { BaseEntity } from 'src/common'
import { Column, Entity } from 'typeorm'
import { RoomAccessType } from '../types'

@Entity('room_access')
export class RoomAccess extends BaseEntity {
    @Column()
    type: RoomAccessType

    @Column()
    roomId: string

    @Column()
    infraUserId: string

    @Column()
    sessionId: string

    @Column()
    createdAt: Date
}
