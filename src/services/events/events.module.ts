import { Module } from '@nestjs/common'
import { RoomsModule } from 'src/services/rooms/rooms.module'
import { ScenesModule } from 'src/services/scenes/scenes.module'
import { UsersModule } from '../users/users.module'
import { EventsService } from './events.service'
import { ProjectsModule } from '../projects/projects.module'

@Module({
    imports: [UsersModule, ProjectsModule, ScenesModule, RoomsModule],
    providers: [EventsService],
    exports: [EventsService]
})
export class EventsModule {}
