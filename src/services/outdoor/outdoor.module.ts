import { Module } from '@nestjs/common'
import { ScenesModule } from 'src/services/scenes/scenes.module'
import { OutdoorService } from './outdoor.service'

@Module({
    imports: [ScenesModule],
    providers: [OutdoorService],
    exports: [OutdoorService]
})
export class OutdoorModule {}
