import { Module } from '@nestjs/common'
import { ManageAssetModule } from '../manage-asset/manage-asset.module'
import { OutdoorService } from './outdoor.service'

@Module({
    imports: [ManageAssetModule],
    providers: [OutdoorService],
    exports: [OutdoorService]
})
export class OutdoorModule {}
