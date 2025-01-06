import { Module } from '@nestjs/common'
import { AdminsModule } from 'src/services/admins/admins.module'
import { AssetsModule } from 'src/services/assets/assets.module'
import { AuthModule } from 'src/services/auth/auth.module'
import { ClearModule } from 'src/services/clear/clear.module'
import { LogsModule } from 'src/services/logs/logs.module'
import { HealthModule } from 'src/services/health/health.module'
import { ManageAssetModule } from 'src/services/manage-asset/manage-asset.module'
import { PaymentsModule } from 'src/services/payments/payments.module'
import { ProjectsModule } from 'src/services/projects/projects.module'
import { RegisterModule } from 'src/services/register/register.module'
import { EventsModule } from 'src/services/events/events.module'
import { RoomsModule } from 'src/services/rooms/rooms.module'
import { ScenesModule } from 'src/services/scenes/scenes.module'
import { SubscriptionsModule } from 'src/services/subscriptions/subscriptions.module'
import { TiersModule } from 'src/services/tiers/tiers.module'
import { AdminsController } from './admins.controller'
import { AssetsController } from './assets.controller'
import { AuthController } from './auth.controller'
import { LogsController } from './logs.controller'
import { HealthController } from './health.controller'
import { PaymentsController } from './payments.controller'
import { ProjectsController } from './projects.controller'
import { RoomsController } from './rooms.controller'
import { ScenesController } from './scenes.controller'
import { SubscriptionsController } from './subscriptions.controller'
import { NotificationsModule } from 'src/services/notifications/notifications.module'
import { NotificationsController } from './notifications.controller'
import { UsersModule } from 'src/services/users/users.module'
import { EventsController } from './events.controller'

const imports = [
    AuthModule,
    AdminsModule,
    ProjectsModule,
    ScenesModule,
    RoomsModule,
    ManageAssetModule,
    ClearModule,
    LogsModule,
    HealthModule,
    TiersModule,
    PaymentsModule,
    SubscriptionsModule,
    RegisterModule,
    AssetsModule,
    NotificationsModule,
    UsersModule,
    EventsModule
]

const controllers = [
    AuthController,
    AdminsController,
    ProjectsController,
    ScenesController,
    RoomsController,
    LogsController,
    HealthController,
    PaymentsController,
    SubscriptionsController,
    AssetsController,
    NotificationsController,
    EventsController
]

@Module({
    imports: imports,
    controllers: controllers
})
export class ControllersModule {}
