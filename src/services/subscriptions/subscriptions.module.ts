import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectsModule } from '../projects/projects.module'
import { ScenesModule } from '../scenes/scenes.module'
import { TiersModule } from '../tiers/tiers.module'
import { Subscription } from './entities'
import { SubscriptionsRepository } from './subscriptions.repository'
import { SubscriptionsService } from './subscriptions.service'

@Module({
    imports: [TypeOrmModule.forFeature([Subscription]), TiersModule, ProjectsModule, ScenesModule],
    providers: [SubscriptionsService, SubscriptionsRepository],
    exports: [SubscriptionsService]
})
export class SubscriptionsModule {}
