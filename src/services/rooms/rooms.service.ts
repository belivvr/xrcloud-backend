import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import {
    Assert,
    CacheService,
    convertTimeToSeconds,
    generateUUID,
    getSlug,
    updateIntersection
} from 'src/common'
import { FAVICON, LOGO } from 'src/common/constants'
import { FileStorageService } from 'src/infra/file-storage/file-storage.service'
import { ReticulumService } from 'src/infra/reticulum/reticulum.service'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { OptionsService } from '../options/options.service'
import { OptionRole } from '../options/types'
import { UsersService } from '../users/users.service'
import {
    CreateRoomAccessDto,
    CreateRoomDto,
    OptionQueryDto,
    RoomAccessQueryDto,
    RoomDto,
    RoomsQueryDto,
    UpdateRoomAccessDto,
    UpdateRoomDto
} from './dto'
import { Room, RoomAccess } from './entities'
import { RoomOption, RoomUrlData } from './interfaces'
import { RoomAccessRepository } from './room-access.repository'
import { RoomConfigService } from './room-config.service'
import { RoomsRepository } from './rooms.repository'
import { RoomEntryType } from './types'

@Injectable()
export class RoomsService {
    constructor(
        private readonly roomsRepository: RoomsRepository,
        private readonly roomAccessRepository: RoomAccessRepository,
        private readonly scenesService: ScenesService,
        private readonly optionsService: OptionsService,
        private readonly reticulumService: ReticulumService,
        private readonly fileStorageService: FileStorageService,
        private readonly cacheService: CacheService,
        private readonly usersService: UsersService,
        private readonly configService: RoomConfigService
    ) {}

    /*
     * rooms
     */
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
            projectId,
            sceneId: sceneId
        }

        const room = await this.roomsRepository.create(createRoom)

        return this.getRoomDto(room.id)
    }

    async findRooms(queryDto: RoomsQueryDto) {
        const { userId, avatarUrl, credentials } = queryDto

        const rooms = await this.roomsRepository.find(queryDto)

        if (rooms.items.length === 0) {
            return { ...rooms, items: [] }
        }

        const dtos = []

        for (const room of rooms.items) {
            const roomUrlData: RoomUrlData = {
                userId,
                avatarUrl,
                credentials
            }

            const dto = await this.getRoomDto(room.id, roomUrlData)

            dtos.push(dto)
        }

        return { ...rooms, items: dtos }
    }

    async getRoom(roomId: string): Promise<Room> {
        const room = await this.roomsRepository.findById(roomId)

        Assert.defined(room, `Room with ID "${roomId}" not found.`)

        return room as Room
    }

    async getRoomDto(roomId: string, roomUrlData?: RoomUrlData) {
        const room = await this.getRoom(roomId)

        const scene = await this.scenesService.getScene(room.sceneId)

        const thumbnailUrl = await this.reticulumService.getThumbnailUrl(scene.thumbnailId)

        const roomUrl = await this.getRoomUrl(roomId, roomUrlData)

        await this.registerUser(room.projectId, roomUrlData?.userId)

        const dto = new RoomDto(room)
        dto.roomUrl = roomUrl
        dto.thumbnailUrl = thumbnailUrl

        return dto
    }

    async getInfraRoom(roomId: string) {
        const room = await this.getRoom(roomId)

        return room
    }

    async getRoomOption(optionId: string, queryDto: OptionQueryDto) {
        const { type } = queryDto

        switch (type) {
            case RoomEntryType.Private: {
                const key = `option:${optionId}`

                const option = await this.cacheService.get(key)

                if (!option) {
                    throw new BadRequestException('Invalid optionId.')
                }

                return JSON.parse(option)
            }

            case RoomEntryType.Public: {
                const option = await this.optionsService.getOption(optionId)

                if (!option) {
                    throw new BadRequestException('Invalid optionId.')
                }

                return option.values
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

    async findRoomByInfraRoomId(infraRoomId: string) {
        const room = await this.roomsRepository.findByInfraRoomId(infraRoomId)

        return room
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

    async countRoomsByProjectIds(projectIds: string[]): Promise<number> {
        let totalRooms = 0

        for (const projectId of projectIds) {
            const count = await this.roomsRepository.countByProjectId(projectId)

            totalRooms += count
        }

        return totalRooms
    }

    async getRoomUrl(roomId: string, roomUrlData?: RoomUrlData) {
        const publicUrl = await this.getPublicUrl(roomId, roomUrlData)
        const privateUrl = await this.getPrivateUrl(roomId, roomUrlData)

        return {
            public: publicUrl,
            private: privateUrl
        }
    }

    private async getPublicUrl(roomId: string, roomUrlData?: RoomUrlData) {
        const room = await this.getRoom(roomId)

        const { projectId, faviconId, logoId } = await this.scenesService.getSceneResources(room.sceneId)

        const token = await this.reticulumService.getAdminToken(projectId)

        const url = this.reticulumService.generateRoomUrl(room.infraRoomId, room.slug)

        const faviconUrl = `${this.fileStorageService.getFileUrl(faviconId, FAVICON)}.ico`
        const logoUrl = `${this.fileStorageService.getFileUrl(logoId, LOGO)}.jpg`

        const roomOption = {
            token,
            faviconUrl,
            logoUrl,
            returnUrl: room.returnUrl,
            avatarUrl: roomUrlData?.avatarUrl
        }

        const { hostOptionId, guestOptionId } = await this.setRoomOption(roomId, roomOption)

        return {
            host: `${url}?public=${hostOptionId}`,
            guest: `${url}?public=${guestOptionId}`
        }
    }

    private async getPrivateUrl(roomId: string, roomUrlData?: RoomUrlData) {
        const room = await this.getRoom(roomId)

        const { projectId, faviconId, logoId } = await this.scenesService.getSceneResources(room.sceneId)

        const token = roomUrlData?.userId
            ? await this.reticulumService.getUserToken(projectId, roomUrlData.userId)
            : await this.reticulumService.getAdminToken(projectId)

        const url = this.reticulumService.generateRoomUrl(room.infraRoomId, room.slug)

        const faviconUrl = `${this.fileStorageService.getFileUrl(faviconId, FAVICON)}.ico`
        const logoUrl = `${this.fileStorageService.getFileUrl(logoId, LOGO)}.jpg`

        const credentialObj: Record<string, string> = {}

        if (roomUrlData?.credentials) {
            const credentialParts = roomUrlData.credentials.split(',')

            for (const part of credentialParts) {
                const [key, value] = part.split(':')

                if (key && value) {
                    credentialObj[key] = value
                }
            }
        }

        const roomOption = {
            token,
            faviconUrl,
            logoUrl,
            returnUrl: room.returnUrl,
            avatarUrl: roomUrlData?.avatarUrl,
            funcs: this.optionsService.generateFuncs(),
            credentials: credentialObj
        }

        const expireTime = convertTimeToSeconds(this.configService.roomOptionExpiration)

        const hostOptionId = generateUUID()

        const hostOptionKey = `option:${hostOptionId}`

        await this.cacheService.set(
            hostOptionKey,
            JSON.stringify({ role: OptionRole.Host, ...roomOption }),
            expireTime
        )

        const guestOptionId = generateUUID()

        const guestOptionKey = `option:${guestOptionId}`

        await this.cacheService.set(
            guestOptionKey,
            JSON.stringify({ role: OptionRole.Guest, ...roomOption }),
            expireTime
        )

        return {
            host: `${url}?private=${hostOptionId}`,
            guest: `${url}?private=${guestOptionId}`
        }
    }

    private async setRoomOption(roomId: string, roomOption: RoomOption) {
        const options = await this.optionsService.findOptionByRoomId(roomId)

        if (options.length === 0) {
            return await this.optionsService.createOption(roomId, roomOption)
        } else {
            return await this.optionsService.updateOption(roomId, roomOption)
        }
    }

    /*
     * room-access
     */
    async createRoomAccess(createRoomAccessDto: CreateRoomAccessDto) {
        return await this.roomAccessRepository.create(createRoomAccessDto)
    }

    async findRoomAccess(roomId: string, queryDto: RoomAccessQueryDto) {
        const roomAccess = await this.roomAccessRepository.findByRoomId(roomId, queryDto)

        return roomAccess
    }

    async getRoomAccess(roomAccessId: number) {
        const roomAccess = await this.roomAccessRepository.findById(roomAccessId)

        if (!roomAccess) {
            throw new NotFoundException(`Room access with ID "${roomAccessId}" not found.`)
        }

        return roomAccess as RoomAccess
    }

    async findRoomAccessBySessionId(sessionId: string) {
        const roomAccess = await this.roomAccessRepository.findBySessionId(sessionId)

        return roomAccess
    }

    async updateRoomAccess(roomAccessId: number, updateRoomAccessDto: UpdateRoomAccessDto) {
        const roomAccess = await this.getRoomAccess(roomAccessId)

        const updateRoomAccess = {
            ...updateRoomAccessDto
        }

        const updatedRoomAccess = updateIntersection(roomAccess, updateRoomAccess)

        const savedRoomAccess = await this.roomAccessRepository.update(updatedRoomAccess)

        Assert.deepEquals(
            savedRoomAccess,
            updatedRoomAccess,
            'The result is different from the update request'
        )

        return savedRoomAccess
    }

    async countRoomAccesses() {
        return await this.roomAccessRepository.count()
    }

    private async registerUser(projectId: string, userId?: string) {
        const infraUserId = userId ? userId : 'admin'

        const userExist = await this.usersService.findUserByProjectIdAndInfraUserId(projectId, infraUserId)

        if (!userExist) {
            const { reticulumId } = await this.reticulumService.getAccountId(projectId, userId)

            const createUser = {
                projectId: projectId,
                infraUserId: infraUserId,
                reticulumId
            }

            await this.usersService.createUser(createUser)
        }
    }
}
