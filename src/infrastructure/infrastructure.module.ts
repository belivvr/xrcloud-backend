import { Module } from '@nestjs/common'
import { SteppayConfigService, SteppayService } from './services'

@Module({
    providers: [SteppayService, SteppayConfigService],
    exports: [SteppayService]
})
export class InfrastructureModule {}
