import { Module } from '@nestjs/common'
import { AdminsModule } from 'src/services/admins/admins.module'
import { ProjectsModule } from 'src/services/projects/projects.module'
import { RoomsModule } from 'src/services/rooms/rooms.module'
import { SubscriptionsModule } from 'src/services/subscriptions/subscriptions.module'
import { ManageAssetService } from './manage-asset.service'

@Module({
    imports: [AdminsModule, ProjectsModule, RoomsModule, SubscriptionsModule],
    providers: [ManageAssetService],
    exports: [ManageAssetService]
})
export class ManageAssetModule {}
