import { Module } from '@nestjs/common'
import { RoomsModule } from 'src/services/rooms/rooms.module'
import { ScenesModule } from 'src/services/scenes/scenes.module'
import { CnuEventModule } from '../cnu-event'
import { SubscriptionsModule } from '../subscriptions/subscriptions.module'
import { EventConfigService } from './event-config.service'
import { EventsService } from './events.service'

@Module({
    imports: [ScenesModule, RoomsModule, SubscriptionsModule, CnuEventModule],
    providers: [EventsService, EventConfigService],
    exports: [EventsService]
})
export class EventsModule {}
