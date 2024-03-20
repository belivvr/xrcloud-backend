import { BaseEntity } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('room_activity')
export class RoomActivity extends BaseEntity {
    @Column()
    roomId: string

    @Column()
    infraUserId: string

    @Column()
    logMessage: string

    @Column()
    createdAt: Date
}
