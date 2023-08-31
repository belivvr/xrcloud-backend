import { Module } from '@nestjs/common'
import { RoomsModule } from 'src/rooms/rooms.module'
import { ScenesModule } from 'src/scenes/scenes.module'
import { EventsController } from './events.controller'
import { EventsService } from './events.service'
import { EventConfigService } from './services'

@Module({
    imports: [ScenesModule, RoomsModule],
    controllers: [EventsController],
    providers: [EventsService, EventConfigService]
})
export class EventsModule {}
