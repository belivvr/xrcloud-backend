import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import {
    Assert,
    CacheService,
    convertTimeToSeconds,
    generateUUID,
    getSlug,
    updateIntersection
} from 'src/common'
import { FileStorageService } from 'src/infra/file-storage/file-storage.service'
import { ReticulumService } from 'src/infra/reticulum/reticulum.service'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { CreateRoomDto, RoomDto, RoomQueryDto, UpdateRoomDto } from './dto'
import { Room } from './entities'
import { RoomConfigService } from './room-config.service'
import { RoomsRepository } from './rooms.repository'

@Injectable()
export class RoomsService {
    constructor(
        private readonly roomsRepository: RoomsRepository,
        private readonly reticulumService: ReticulumService,
        private readonly fileStorageService: FileStorageService,
        private readonly cacheService: CacheService,
        private readonly configService: RoomConfigService,
        private readonly scenesService: ScenesService
    ) {}

    async createRoom(createRoomDto: CreateRoomDto) {
        const { projectId, sceneId, ...createData } = createRoomDto

        const count = await this.restrictRoomCreation(projectId)

        if (count >= 3) {
            throw new ForbiddenException(
                `Project with ID "${projectId}" exceeds the number of rooms that can be created.`
            )
        }

        const scene = await this.scenesService.getScene(sceneId)

        const token = await this.reticulumService.getAdminToken(projectId)

        const infraRoom = await this.reticulumService.createRoom(scene.infraSceneId, createData.name, token)

        const slug = getSlug(infraRoom.url)

        const createRoom = {
            ...createData,
            slug: slug,
            infraRoomId: infraRoom.hub_id,
            thumbnailId: scene.thumbnailId,
            projectId: projectId,
            sceneId: scene.id
        }

        return await this.roomsRepository.create(createRoom)
    }

    async findRooms(queryDto: RoomQueryDto) {
        const rooms = await this.roomsRepository.find(queryDto)

        return rooms
    }

    async getRoom(roomId: string): Promise<Room> {
        const room = await this.roomsRepository.findById(roomId)

        Assert.defined(room, `Room with ID "${roomId}" not found.`)

        return room as Room
    }

    async updateRoom(roomId: string, updateRoomDto: UpdateRoomDto) {
        const room = await this.getRoom(roomId)

        const token = await this.reticulumService.getAdminToken(room.projectId)

        const updateRoomArgs = {
            ...updateRoomDto,
            token: token
        }

        const { hubs: updatedInfraRoom } = await this.reticulumService.updateRoom(
            room.infraRoomId,
            updateRoomArgs
        )

        const updateRoom = {
            ...updateRoomDto,
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

    async roomExists(roomId: string): Promise<boolean> {
        return this.roomsRepository.exist(roomId)
    }

    async findRoomsBySceneId(sceneId: string) {
        const rooms = await this.roomsRepository.findBySceneId(sceneId)

        return rooms
    }

    async findRoomByInfraRoomid(infraRoomId: string) {
        const room = await this.roomsRepository.findByInfraRoomId(infraRoomId)

        if (!room) {
            throw new NotFoundException(`Room with infraRoomId "${infraRoomId}" not found.`)
        }

        return room
    }

    async count() {
        return await this.roomsRepository.count()
    }

    async validateRoomExists(roomId: string) {
        const roomExists = await this.roomExists(roomId)

        if (!roomExists) {
            throw new NotFoundException(`Room with ID "${roomId}" not found.`)
        }
    }

    async getRoomDto(roomId: string, userId?: string) {
        const room = await this.getRoom(roomId)

        const scene = await this.scenesService.getScene(room.sceneId)

        const thumbnailUrl = await this.reticulumService.getThumbnailUrl(scene.thumbnailId)
        const roomUrl = await this.getRoomUrl(roomId, userId)

        const dto = new RoomDto(room)
        dto.roomUrl = roomUrl
        dto.thumbnailUrl = thumbnailUrl

        return dto
    }

    async getRoomUrl(roomId: string, userId?: string) {
        const room = await this.getRoom(roomId)

        const { projectId, faviconId, logoId } = await this.scenesService.getSceneResources(room.sceneId)

        let token

        if (!userId) {
            token = await this.reticulumService.getAdminToken(projectId)
        } else {
            token = await this.reticulumService.getUserToken(projectId, userId)
        }

        const { url, options } = this.reticulumService.getRoomInfo(room.infraRoomId, room.slug, token)

        let roomUrl = url

        const faviconUrl = this.fileStorageService.getFileUrl(faviconId, 'favicon')
        const logoUrl = this.fileStorageService.getFileUrl(logoId, 'logo')

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

    async getRoomDetails(sessionId: string) {
        // const roomAccess = await this.roomAccessRepository.findAccessBySessionId(sessionId)

        // await this.validateRoomExists(roomAccess.roomId)

        // const room = await this.roomsRepository.findById(roomAccess.roomId) as Room

        // const roomDetailsKey = `roomDetails:${room.id}`

        // const savedDetails = await this.cacheService.get(roomDetailsKey)

        // let roomDetails

        // if (savedDetails) {
        //     roomDetails = JSON.parse(savedDetails)
        // } else {
        //     roomDetails = {
        //         projectId: room.projectId,
        //         roomId: room.id,
        //         userCount: 0,
        //         users: []
        //     }
        // }

        return { roomDetailsKey: '', roomDetails: {} }
    }

    async restrictRoomCreation(projectId: string) {
        const count = await this.roomsRepository.countByProjectId(projectId)

        return count
    }
}
