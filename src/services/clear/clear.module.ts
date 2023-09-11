import { Module } from '@nestjs/common'
import { AdminsModule } from 'src/services/admins/admins.module'
import { ProjectsModule } from 'src/services/projects/projects.module'
import { RoomsModule } from 'src/services/rooms/rooms.module'
import { ScenesModule } from 'src/services/scenes/scenes.module'
import { ClearService } from './clear.service'

@Module({
    imports: [AdminsModule, ProjectsModule, ScenesModule, RoomsModule],
    providers: [ClearService],
    exports: [ClearService]
})
export class ClearModule {}
