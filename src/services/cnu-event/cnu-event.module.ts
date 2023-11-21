import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InfraModule } from 'src/infra/infra.module'
import { AdminsModule } from '../admins/admins.module'
import { ProjectsModule } from '../projects/projects.module'
import { RoomsModule } from '../rooms/rooms.module'
import { ScenesModule } from '../scenes/scenes.module'
import { CnuEventConfigService } from './cnu-event-config.service'
import { CnuEventRepository } from './cnu-event.repository'
import { CnuEventService } from './cnu-event.service'
import { CnuEvent } from './entities'

@Module({
    imports: [
        TypeOrmModule.forFeature([CnuEvent]),
        AdminsModule,
        ProjectsModule,
        ScenesModule,
        RoomsModule,
        InfraModule
    ],
    providers: [CnuEventService, CnuEventRepository, CnuEventConfigService],
    exports: [CnuEventService]
})
export class CnuEventModule {}
