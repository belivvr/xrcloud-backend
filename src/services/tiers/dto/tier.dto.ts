import { Tier } from '../entities'

export class TierDto {
    id: string
    name: string
    description: string
    currency: string
    price: string
    maxStorage: string
    maxRooms: number
    maxRoomSize: number

    constructor(tier: Tier) {
        const { id, name, description, currency, price, maxStorage, maxRooms, maxRoomSize } = tier

        Object.assign(this, { id, name, description, currency, price, maxStorage, maxRooms, maxRoomSize })
    }
}
