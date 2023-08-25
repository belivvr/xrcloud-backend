import { Module, forwardRef } from '@nestjs/common'
import { AdminsModule } from 'src/admins/admins.module'
import { ProjectsModule } from 'src/projects/projects.module'
import { RoomsModule } from 'src/rooms/rooms.module'
import { ScenesModule } from 'src/scenes/scenes.module'
import { ClearService } from './clear.service'

@Module({
    imports: [
        AdminsModule,
        forwardRef(() => ProjectsModule),
        forwardRef(() => ScenesModule),
        forwardRef(() => RoomsModule)
    ],
    providers: [ClearService],
    exports: [ClearService]
})
export class ClearModule {}
