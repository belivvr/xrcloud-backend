import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { updateIntersection } from 'src/common'
import { ReticulumService } from 'src/reticulum'
import { ScenesService } from 'src/scenes'
import { UsersService } from 'src/users'
import { CreateRoomDto, QueryDto, RoomDto, UpdateRoomDto } from './dto'
import { RoomsRepository } from './rooms.repository'

@Injectable()
export class RoomsService {
    constructor(
        private readonly roomsRepository: RoomsRepository,
        private readonly usersService: UsersService,
        private readonly scenesService: ScenesService,
        private readonly reticulumService: ReticulumService
    ) {}

    async create(projectId: string, createRoomDto: CreateRoomDto) {
        const count = await this.restrictRoomCreation(projectId)

        if (count >= 3) {
            throw new ForbiddenException(
                `Project with ID "${projectId}" exceeds the number of rooms that can be created`
            )
        }

        const { personalId, sceneId, ...data } = createRoomDto

        const scene = await this.scenesService.getScene(sceneId)

        const token = await this.usersService.getUserToken(projectId, personalId)

        const infraRoom = await this.reticulumService.createRoom(scene.infraSceneId, data.name, token)

        const user = await this.usersService.getUser(projectId, personalId)

        const createRoom = {
            ...data,
            infraRoomId: infraRoom.hub_id,
            thumbnailId: scene.thumbnailId,
            projectId: projectId,
            sceneId: scene.id,
            ownerId: user.id
        }

        return await this.roomsRepository.create(createRoom)
    }

    async findAll(queryDto: QueryDto) {
        const rooms = await this.roomsRepository.findAll(queryDto)

        return rooms
    }

    async update(projectId: string, roomId: string, updateRoomDto: UpdateRoomDto) {
        const { personalId, name, size } = updateRoomDto

        const room = await this.getRoom(roomId)

        const token = await this.usersService.getUserToken(projectId, personalId)

        const updateRoomArgs = {
            name: name,
            size: size,
            token: token
        }

        await this.reticulumService.updateRoom(room.infraRoomId, updateRoomArgs)

        const updateRoom = {
            name: name,
            size: size
        }

        const updatedRoom = updateIntersection(room, updateRoom)

        return await this.roomsRepository.update(updatedRoom)
    }

    async remove(roomId: string) {
        const room = await this.getRoom(roomId)

        await this.roomsRepository.remove(room)
    }

    async getRoom(roomId: string) {
        const scene = await this.roomsRepository.findById(roomId)

        if (!scene) {
            throw new NotFoundException(`Room with ID "${roomId}" not found`)
        }

        return scene
    }

    async getRoomDto(roomId: string) {
        const room = await this.getRoom(roomId)

        const scene = await this.scenesService.getScene(room.sceneId)

        const thumbnailUrl = await this.reticulumService.getThumbnailUrl(scene.thumbnailId)

        const roomUrl = this.reticulumService.getRoomUrl(room.infraRoomId)

        const dto = new RoomDto(room)
        dto.roomUrl = roomUrl
        dto.thumbnailUrl = thumbnailUrl

        return dto
    }

    async restrictRoomCreation(projectId: string) {
        const count = await this.roomsRepository.countByProjectId(projectId)

        return count
    }
}
