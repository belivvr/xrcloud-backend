import { Injectable } from '@nestjs/common'
import { EntityExistsGuard } from 'src/common'
import { RoomsService } from 'src/services/rooms/rooms.service'

@Injectable()
export class RoomExistsGuard extends EntityExistsGuard<RoomsService> {
    protected readonly entityName = 'Room'
    protected readonly entityIdKey = 'roomId'

    constructor(private readonly roomsService: RoomsService) {
        super(roomsService)
    }

    async entityExists(id: string): Promise<boolean> {
        return this.roomsService.roomExists(id)
    }
}
