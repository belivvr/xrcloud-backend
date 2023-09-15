import { Module } from '@nestjs/common'
import { AdminsModule } from 'src/services/admins/admins.module'
import { AuthModule } from 'src/services/auth/auth.module'
import { ClearModule } from 'src/services/clear/clear.module'
import { EventsModule } from 'src/services/events/events.module'
import { HealthModule } from 'src/services/health/health.module'
import { ManageAssetModule } from 'src/services/manage-asset/manage-asset.module'
import { OutdoorModule } from 'src/services/outdoor/outdoor.module'
import { PaymentsModule } from 'src/services/payments/payments.module'
import { ProjectsModule } from 'src/services/projects/projects.module'
import { RoomsModule } from 'src/services/rooms/rooms.module'
import { ScenesModule } from 'src/services/scenes/scenes.module'
import { SubscriptionsModule } from 'src/services/subscriptions/subscriptions.module'
import { TiersModule } from 'src/services/tiers/tiers.module'
import { AdminsController } from './admins.controller'
import { ApiProjectsController } from './api-projects.controller'
import { ApiRoomsController } from './api-rooms.controller'
import { ApiScenesController } from './api-scenes.controller'
import { AuthController } from './auth.controller'
import { EventsController } from './events.controller'
import { HealthController } from './health.controller'
import { OutdoorController } from './outdoor.controller'
import { PaymentsController } from './payments.controller'
import { ProjectsController } from './projects.controller'
import { RoomsController } from './rooms.controller'
import { ScenesController } from './scenes.controller'
import { SubscriptionsController } from './subscriptions.controller'

const imports = [
    AuthModule,
    AdminsModule,
    ProjectsModule,
    ScenesModule,
    RoomsModule,
    ManageAssetModule,
    ClearModule,
    OutdoorModule,
    EventsModule,
    HealthModule,
    TiersModule,
    PaymentsModule,
    SubscriptionsModule
]

const controllers = [
    AuthController,
    AdminsController,
    ProjectsController,
    ApiProjectsController,
    ScenesController,
    ApiScenesController,
    RoomsController,
    ApiRoomsController,
    OutdoorController,
    EventsController,
    HealthController,
    PaymentsController,
    SubscriptionsController
]

@Module({
    imports: imports,
    controllers: controllers
})
export class ControllersModule {}
