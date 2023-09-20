import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminsModule } from '../admins/admins.module'
import { ProjectsModule } from '../projects/projects.module'
import { ScenesModule } from '../scenes/scenes.module'
import { TiersModule } from '../tiers/tiers.module'
import { Subscription } from './entities'
import { SubscriptionsRepository } from './subscriptions.repository'
import { SubscriptionsService } from './subscriptions.service'

@Module({
    imports: [TypeOrmModule.forFeature([Subscription]), AdminsModule, TiersModule, ProjectsModule, ScenesModule],
    providers: [SubscriptionsService, SubscriptionsRepository],
    exports: [SubscriptionsService]
})
export class SubscriptionsModule {}
