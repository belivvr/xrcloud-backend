import { Room } from '../entities'

export class RoomDto {
    id: string
    name: string
    size: number
    sceneId: string
    createdAt: Date
    updatedAt: Date
    roomUrl: string
    thumbnailUrl: string

    constructor(room: Room) {
        const { id, name, size, sceneId, createdAt, updatedAt } = room

        Object.assign(this, {
            id,
            name,
            size,
            sceneId,
            createdAt,
            updatedAt
        })
    }
}
