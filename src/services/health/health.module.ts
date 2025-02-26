import { Module } from '@nestjs/common'
import { AdminsModule } from 'src/services/admins/admins.module'
import { RoomsModule } from 'src/services/rooms/rooms.module'
import { ScenesModule } from '../scenes/scenes.module'
import { HealthService } from './health.service'

@Module({
    imports: [AdminsModule, RoomsModule, ScenesModule],
    providers: [HealthService],
    exports: [HealthService]
})
export class HealthModule {}
