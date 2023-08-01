import { Module } from '@nestjs/common'
import { ReticulumService } from './reticulum.service'
import { ReticulumConfigService } from './services/reticulum-config.service'

@Module({
    providers: [ReticulumService, ReticulumConfigService],
    exports: [ReticulumService]
})
export class ReticulumModule {}
