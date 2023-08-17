import { Module } from '@nestjs/common'
import { ScenesModule } from 'src/scenes'
import { OutdoorController } from './outdoor.controller'
import { OutdoorService } from './outdoor.service'

@Module({
    imports: [ScenesModule],
    controllers: [OutdoorController],
    providers: [OutdoorService]
})
export class OutdoorModule {}
