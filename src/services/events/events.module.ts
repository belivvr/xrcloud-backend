import { Module } from '@nestjs/common'
import { RoomsModule } from 'src/services/rooms/rooms.module'
import { ScenesModule } from 'src/services/scenes/scenes.module'
import { CnuEventModule } from '../cnu-event'
import { SubscriptionsModule } from '../subscriptions/subscriptions.module'
import { UsersModule } from '../users/users.module'
import { EventsService } from './events.service'

@Module({
    imports: [ScenesModule, RoomsModule, SubscriptionsModule, CnuEventModule, UsersModule],
    providers: [EventsService],
    exports: [EventsService]
})
export class EventsModule {}
