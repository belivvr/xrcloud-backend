import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Assert, CacheService, getSlug, updateIntersection } from 'src/common'
import { FAVICON, LOGO } from 'src/common/constants'
import { FileStorageService } from 'src/infra/file-storage/file-storage.service'
import { ReticulumService } from 'src/infra/reticulum/reticulum.service'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { CreateRoomDto, OptionQueryDto, RoomDto, RoomsQueryDto, UpdateRoomDto } from './dto'
import { Room } from './entities'
import { RoomOption } from './interfaces'
import { RoomConfigService } from './room-config.service'
import { RoomsRepository } from './rooms.repository'
import { RoomOptionType } from './types'

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

        const scene = await this.scenesService.getScene(sceneId)

        const token = await this.reticulumService.getAdminToken(projectId)

        const createRoomData = {
            ...createData,
            token: token
        }

        const infraRoom = await this.reticulumService.createRoom(scene.infraSceneId, createRoomData)

        const slug = getSlug(infraRoom.url)

        const createRoom = {
            ...createData,
            slug,
            infraRoomId: infraRoom.hub_id,
            thumbnailId: scene.thumbnailId,
            // TODO: public
            isPublic: true,
            projectId,
            sceneId: sceneId
        }

        const room = await this.roomsRepository.create(createRoom)

        return this.getRoomDto(room.id)
    }

    async findRooms(queryDto: RoomsQueryDto) {
        const rooms = await this.roomsRepository.find(queryDto)

        if (rooms.items.length === 0) {
            return { ...rooms, items: [] }
        }

        const dtos = await Promise.all(rooms.items.map((room) => this.getRoomDto(room.id)))

        return { ...rooms, items: dtos }
    }

    async getRoom(roomId: string): Promise<Room> {
        const room = await this.roomsRepository.findById(roomId)

        Assert.defined(room, `Room with ID "${roomId}" not found.`)

        return room as Room
    }

    async getRoomOption(optionId: string, queryDto: OptionQueryDto) {
        const { type } = queryDto

        switch (type) {
            case RoomOptionType.private: {
                const key = `option:${optionId}`

                const option = await this.cacheService.get(key)

                if (!option) {
                    throw new BadRequestException('Invalid optionId.')
                }

                return JSON.parse(option)
            }

            case RoomOptionType.public: {
                const roomId = optionId

                await this.validateRoomExists(roomId)

                const room = await this.getRoom(roomId)

                const { faviconId, logoId } = await this.scenesService.getSceneResources(room.sceneId)

                const option = {
                    faviconUrl: `${this.fileStorageService.getFileUrl(faviconId, FAVICON)}.ico`,
                    logoUrl: `${this.fileStorageService.getFileUrl(logoId, LOGO)}.jpg`
                } as RoomOption

                return option
            }

            default: {
                break
            }
        }
    }

    async updateRoom(roomId: string, updateRoomDto: UpdateRoomDto) {
        const room = await this.getRoom(roomId)

        const token = await this.reticulumService.getAdminToken(room.projectId)

        const updateRoomData = {
            ...updateRoomDto,
            token: token
        }

        const { hubs: updatedInfraRoom } = await this.reticulumService.updateRoom(
            room.infraRoomId,
            updateRoomData
        )

        const updateRoom = {
            ...updateRoomDto,
            slug: updatedInfraRoom[0].slug
        }

        const updatedRoom = updateIntersection(room, updateRoom)

        const savedRoom = await this.roomsRepository.update(updatedRoom)

        Assert.deepEquals(savedRoom, updatedRoom, 'The result is different from the update request')

        return this.getRoomDto(savedRoom.id)
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

    async countRooms() {
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

        // TODO: public
        const token = !userId
            ? await this.reticulumService.getAdminToken(projectId)
            : await this.reticulumService.getUserToken(projectId, userId)

        // const token =
        //     room.isPublic || !userId
        //         ? await this.reticulumService.getAdminToken(projectId)
        //         : await this.reticulumService.getUserToken(projectId, userId)

        const { url, options } = this.reticulumService.getRoomInfo(room.infraRoomId, room.slug, token)

        return `${url}?public=${room.id}`

        // const extendedOptions = {
        //     ...options,
        //     faviconUrl: `${this.fileStorageService.getFileUrl(faviconId, FAVICON)}.ico`,
        //     logoUrl: `${this.fileStorageService.getFileUrl(logoId, LOGO)}.jpg`
        // } as RoomOption

        // if (room.isPublic) {
        //     return `${url}?public=${room.id}`
        // }

        // const optionId = generateUUID()

        // const key = `option:${optionId}`

        // const expireTime = convertTimeToSeconds(this.configService.roomOptionExpiration)

        // await this.cacheService.set(key, JSON.stringify(extendedOptions), expireTime)

        // return `${url}?private=${optionId}`
    }

    async countRoomsByProjectIds(projectIds: string[]): Promise<number> {
        let totalRooms = 0

        for (const projectId of projectIds) {
            const count = await this.roomsRepository.countByProjectId(projectId)

            totalRooms += count
        }

        return totalRooms
    }
}
