import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { getSlug, updateIntersection } from 'src/common'
import { ReticulumService } from 'src/reticulum'
import { ScenesService } from 'src/scenes'
import { CreateRoomDto, QueryDto, RoomDto, UpdateRoomDto } from './dto'
import { RoomsRepository } from './rooms.repository'

@Injectable()
export class RoomsService {
    constructor(
        private readonly roomsRepository: RoomsRepository,
        private readonly scenesService: ScenesService,
        private readonly reticulumService: ReticulumService
    ) {}

    async createRoom(createRoomDto: CreateRoomDto) {
        const { projectId, userId, sceneId, ...data } = createRoomDto

        const count = await this.restrictRoomCreation(projectId)

        if (count >= 3) {
            throw new ForbiddenException(
                `Project with ID "${projectId}" exceeds the number of rooms that can be created.`
            )
        }

        const scene = await this.scenesService.getScene(sceneId)

        const { token } = await this.reticulumService.login(userId)

        const infraRoom = await this.reticulumService.createRoom(scene.infraSceneId, data.name, token)

        const slug = getSlug(infraRoom.url)

        const createRoom = {
            ...data,
            slug: slug,
            infraRoomId: infraRoom.hub_id,
            thumbnailId: scene.thumbnailId,
            projectId: projectId,
            sceneId: scene.id
        }

        return await this.roomsRepository.create(createRoom)
    }

    async findRooms(queryDto: QueryDto) {
        const rooms = await this.roomsRepository.find(queryDto)

        return rooms
    }

    async updateRoom(updateRoomDto: UpdateRoomDto) {
        const { userId, roomId, ...data } = updateRoomDto

        const room = await this.getRoom(roomId)

        const { token } = await this.reticulumService.login(userId)

        const updateRoomArgs = {
            ...data,
            token: token
        }

        const { hubs: updatedInfraRoom } = await this.reticulumService.updateRoom(
            room.infraRoomId,
            updateRoomArgs
        )

        const updateRoom = {
            ...data,
            slug: updatedInfraRoom[0].slug
        }

        const updatedRoom = updateIntersection(room, updateRoom)

        return await this.roomsRepository.update(updatedRoom)
    }

    async removeRoom(roomId: string) {
        const room = await this.getRoom(roomId)

        await this.roomsRepository.remove(room)
    }

    async getRoom(roomId: string) {
        const scene = await this.roomsRepository.findById(roomId)

        if (!scene) {
            throw new NotFoundException(`Room with ID "${roomId}" not found.`)
        }

        return scene
    }

    async getRoomDto(roomId: string, token?: string) {
        const room = await this.getRoom(roomId)

        const scene = await this.scenesService.getScene(room.sceneId)

        const thumbnailUrl = await this.reticulumService.getThumbnailUrl(scene.thumbnailId)
        const roomUrl = this.reticulumService.getRoomUrl(room.infraRoomId, room.slug)

        const dto = new RoomDto(room)
        dto.roomUrl = token ? roomUrl + `?token=${token}` : roomUrl
        dto.thumbnailUrl = thumbnailUrl

        return dto
    }

    async restrictRoomCreation(projectId: string) {
        const count = await this.roomsRepository.countByProjectId(projectId)

        return count
    }
}
