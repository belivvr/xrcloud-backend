import { Module } from '@nestjs/common'
import { AdminsModule } from 'src/admins/admins.module'
import { RoomsModule } from 'src/rooms/rooms.module'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'

@Module({
    imports: [AdminsModule, RoomsModule],
    controllers: [HealthController],
    providers: [HealthService]
})
export class HealthModule {}
