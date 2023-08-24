import { ForbiddenException, Inject, Injectable, forwardRef } from '@nestjs/common'
import {
    Assert,
    CacheService,
    convertTimeToSeconds,
    generateUUID,
    getSlug,
    updateIntersection
} from 'src/common'
import { FileStorageService } from 'src/file-storage'
import { ProjectsService } from 'src/projects'
import { ReticulumService } from 'src/reticulum'
import { ScenesService } from 'src/scenes'
import { CreateRoomDto, QueryDto, RoomDto, UpdateRoomDto } from './dto'
import { Room } from './entities'
import { RoomsRepository } from './rooms.repository'
import { RoomConfigService } from './services/room-config.service'

@Injectable()
export class RoomsService {
    constructor(
        private readonly roomsRepository: RoomsRepository,
        private readonly scenesService: ScenesService,
        private readonly reticulumService: ReticulumService,
        private readonly configService: RoomConfigService,
        private readonly cacheService: CacheService,
        private readonly fileStorageService: FileStorageService,
        @Inject(forwardRef(() => ProjectsService))
        private readonly projectsService: ProjectsService
    ) {}

    async createRoom(createRoomDto: CreateRoomDto) {
        const { projectId, sceneId, ...data } = createRoomDto

        const count = await this.restrictRoomCreation(projectId)

        if (count >= 3) {
            throw new ForbiddenException(
                `Project with ID "${projectId}" exceeds the number of rooms that can be created.`
            )
        }

        const scene = await this.scenesService.getScene(sceneId)

        const token = await this.reticulumService.getToken(projectId, this.configService.roomOptionExpiration)

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

    async getRoom(roomId: string): Promise<Room> {
        const room = await this.roomsRepository.findById(roomId)

        Assert.defined(room, `Room with ID "${roomId}" not found.`)

        return room as Room
    }

    async updateRoom(updateRoomDto: UpdateRoomDto) {
        const { roomId, ...data } = updateRoomDto

        const room = await this.getRoom(roomId)

        const token = await this.reticulumService.getToken(
            room.projectId,
            this.configService.roomOptionExpiration
        )

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

        const savedRoom = await this.roomsRepository.update(updatedRoom)

        Assert.deepEquals(savedRoom, updatedRoom, 'The result is different from the update request')

        return savedRoom
    }

    async removeRoom(roomId: string) {
        const room = await this.getRoom(roomId)

        await this.roomsRepository.remove(room)
    }

    async getRoomDto(roomId: string, token?: string) {
        const room = await this.getRoom(roomId)

        const scene = await this.scenesService.getScene(room.sceneId)

        const thumbnailUrl = await this.reticulumService.getThumbnailUrl(scene.thumbnailId)
        const roomUrl = await this.getRoomUrl(roomId, token)

        const dto = new RoomDto(room)
        dto.roomUrl = roomUrl
        dto.thumbnailUrl = thumbnailUrl

        return dto
    }

    async getRoomUrl(roomId: string, token?: string) {
        const room = await this.getRoom(roomId)

        const project = await this.projectsService.getProject(room.projectId)

        const { url, options } = this.reticulumService.getRoomInfo(room.infraRoomId, room.slug, token)

        let roomUrl = url

        const faviconUrl = this.fileStorageService.getFileUrl(project.faviconId, 'favicon')
        const logoUrl = this.fileStorageService.getFileUrl(project.logoId, 'logo')

        if (options?.token) {
            const optionId = generateUUID()

            const key = `option:${optionId}`

            const extendedOptions = {
                ...options,
                faviconUrl: `${faviconUrl}.ico`,
                logoUrl: `${logoUrl}.jpg`
            }

            const expireTime = convertTimeToSeconds(this.configService.roomOptionExpiration)

            await this.cacheService.set(key, JSON.stringify(extendedOptions), expireTime)

            roomUrl = `${url}?optId=${optionId}`
        }

        return roomUrl
    }

    async roomExists(roomId: string): Promise<boolean> {
        return this.roomsRepository.exist(roomId)
    }

    async restrictRoomCreation(projectId: string) {
        const count = await this.roomsRepository.countByProjectId(projectId)

        return count
    }
}
