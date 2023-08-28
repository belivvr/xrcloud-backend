import { Module } from '@nestjs/common'
import { AdminsModule } from 'src/admins/admins.module'
import { RoomsModule } from 'src/rooms/rooms.module'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'
import { HealthConfigService } from './services/health-config.service'

@Module({
    imports: [AdminsModule, RoomsModule],
    controllers: [HealthController],
    providers: [HealthService, HealthConfigService]
})
export class HealthModule {}
