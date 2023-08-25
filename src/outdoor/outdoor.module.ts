import { Module } from '@nestjs/common'
import { ScenesModule } from 'src/scenes/scenes.module'
import { OutdoorController } from './outdoor.controller'
import { OutdoorService } from './outdoor.service'

@Module({
    imports: [ScenesModule],
    controllers: [OutdoorController],
    providers: [OutdoorService]
})
export class OutdoorModule {}
