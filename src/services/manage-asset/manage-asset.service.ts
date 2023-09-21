import { Injectable } from '@nestjs/common'
import { ProjectsService } from 'src/services/projects/projects.service'
import { CreateRoomDto, RoomDto, UpdateRoomDto } from 'src/services/rooms/dto'
import { RoomsService } from 'src/services/rooms/rooms.service'
import { SubscriptionsService } from 'src/services/subscriptions/subscriptions.service'
import { AdminsService } from '../admins/admins.service'

@Injectable()
export class ManageAssetService {
    constructor(
        private readonly adminsService: AdminsService,
        private readonly projectsService: ProjectsService,
        private readonly roomsService: RoomsService,
        private readonly subscriptionsService: SubscriptionsService
    ) {}

    /*
     * rooms
     */
    async createRoom(createRoomDto: CreateRoomDto) {
        const { projectId, sceneId, ...createData } = createRoomDto

        const project = await this.projectsService.getProject(projectId)

        const admin = await this.adminsService.getAdmin(project.adminId)

        const projects = await this.projectsService.findProjectsByAdminId(admin.id)

        const projectIds = projects.map((project) => project.id)

        const roomCount = await this.roomsService.countRoomsByProjectIds(projectIds)

        await this.subscriptionsService.validateRoomCreation(sceneId, roomCount, createData.size)

        return await this.roomsService.createRoom(createRoomDto)
    }

    async updateRoom(roomId: string, updateRoomDto: UpdateRoomDto) {
        const room = await this.roomsService.getRoom(roomId)

        const roomDto = new RoomDto(room)

        await this.subscriptionsService.validateRoomUpdate(roomDto, updateRoomDto.size)

        return await this.roomsService.updateRoom(roomId, updateRoomDto)
    }
}
