import { Room } from '../entities'
import { RoomUrl } from '../types'

export class RoomDto {
    id: string
    name: string
    size: number
    sceneId: string
    createdAt: Date
    updatedAt: Date
    isPublic: boolean
    returnUrl: string
    roomUrl: RoomUrl
    thumbnailUrl: string

    constructor(room: Room) {
        const { id, name, size, sceneId, createdAt, updatedAt, isPublic, returnUrl } = room

        Object.assign(this, {
            id,
            name,
            size,
            sceneId,
            createdAt,
            updatedAt,
            isPublic,
            returnUrl
        })
    }
}
