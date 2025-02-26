import { Room } from '../entities'
import { RoomUrl } from '../types'

export class RoomDto {
    id: string
    name: string
    size: number
    tags: string[]
    sceneId: string
    createdAt: Date
    updatedAt: Date
    returnUrl: string
    roomUrl: RoomUrl
    thumbnailUrl: string

    constructor(room: Room) {
        const { id, name, size, tags, sceneId, createdAt, updatedAt, returnUrl } = room

        Object.assign(this, {
            id,
            name,
            size,
            tags,
            sceneId,
            createdAt,
            updatedAt,
            returnUrl
        })
    }
}
