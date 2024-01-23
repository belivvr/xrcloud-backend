import { Module } from '@nestjs/common'
import { InfraModule } from 'src/infra/infra.module'
import { RoomsModule } from '../rooms/rooms.module'
import { ScenesModule } from '../scenes/scenes.module'
import { NotificationsService } from './notifications.service'

@Module({
    imports: [InfraModule, ScenesModule, RoomsModule],
    providers: [NotificationsService],
    exports: [NotificationsService]
})
export class NotificationsModule {}
