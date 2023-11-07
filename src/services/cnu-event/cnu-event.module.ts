import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InfraModule } from 'src/infra/infra.module'
import { ProjectsModule } from '../projects/projects.module'
import { RoomsModule } from '../rooms/rooms.module'
import { ScenesModule } from '../scenes/scenes.module'
import { CnuEventRepository } from './cnu-event.repository'
import { CnuEventService } from './cnu-event.service'
import { CnuEvent } from './entities'

@Module({
    imports: [TypeOrmModule.forFeature([CnuEvent]), ProjectsModule, ScenesModule, RoomsModule, InfraModule],
    providers: [CnuEventService, CnuEventRepository],
    exports: [CnuEventService]
})
export class CnuEventModule {}
