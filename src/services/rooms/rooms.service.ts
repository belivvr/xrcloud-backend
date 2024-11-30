import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import {
    Assert,
    CacheService,
    FileStorage,
    convertTimeToSeconds,
    generateUUID,
    getSlug,
    updateIntersection
} from 'src/common'
import { FAVICON, LOGO } from 'src/common/constants'
import { ReticulumService } from 'src/infra/reticulum/reticulum.service'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { OptionsService } from '../options/options.service'
import { OptionRole } from '../options/types'
import { UsersService } from '../users/users.service'
import {    
    OptionQueryDto,    
    RoomDto,
    RoomLogsQueryDto,
    RoomsQueryDto,
} from './dto'
import { Room } from './entities'
import { RoomOption, RoomUrlData } from './interfaces'
import { RoomConfigService } from './room-config.service'
import { RoomsRepository } from './rooms.repository'
import { RoomEntryType } from './types'
import { Logger } from '@nestjs/common'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { RoomLogsRepository } from '../logs/room-logs.repository'
import { LogCode } from '../logs/dto'
@Injectable()
export class RoomsService {
    constructor(
        private readonly roomsRepository: RoomsRepository,
        private readonly scenesService: ScenesService,
        private readonly optionsService: OptionsService,
        private readonly reticulumService: ReticulumService,
        private readonly cacheService: CacheService,
        private readonly usersService: UsersService,
        private readonly roomLogsRepository: RoomLogsRepository,        
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
        const { userId, avatarUrl, linkPayload } = queryDto

        const rooms = await this.roomsRepository.find(queryDto)

        if (rooms.items.length === 0) {
            return { ...rooms, items: [] }
        }

        const dtos = []
        
        for (const room of rooms.items) {
            const roomUrlData: RoomUrlData = {
                userId,
                avatarUrl,
                linkPayload
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

        const user = await this.registerUser(room.projectId, roomUrlData?.userId)

        const roomUrl = await this.getRoomUrl(roomId, roomUrlData)


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

                console.log("getRoomOption:",JSON.parse(option))

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

        let token;
        if (roomUrlData?.userId) {
            // userId가 존재하는지 확인
            Logger.log(`User ID exists: ${roomUrlData.userId}`);
            token = await this.reticulumService.getUserToken(projectId, roomUrlData.userId);            

            // token이 유효한지 확인
            if (!token) {
                Logger.error(`Failed to retrieve token for user ID: ${roomUrlData.userId}`);
                throw new Error('Invalid token for user.');
            }
        } else {
            token = await this.reticulumService.getAdminToken(projectId);
            
            // token이 유효한지 확인
            if (!token) {
                Logger.error(`Failed to retrieve admin token for project ID: ${projectId}`);
                throw new Error('Invalid admin token.');
            }
        }
        Logger.log(`User token exists: ${token}`);

        const url = this.reticulumService.generateRoomUrl(room.infraRoomId, room.slug)

        const faviconUrl = `${FileStorage.getFileUrl(faviconId, FAVICON)}.ico`
        const logoUrl = `${FileStorage.getFileUrl(logoId, LOGO)}.jpg`

        const roomOption = {
            token,
            faviconUrl,
            logoUrl,
            returnUrl: room.returnUrl,
            displayName: roomUrlData?.displayName,
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

        const faviconUrl = `${FileStorage.getFileUrl(faviconId, FAVICON)}.ico`
        const logoUrl = `${FileStorage.getFileUrl(logoId, LOGO)}.jpg`

        Logger.log(`User private token exists: ${token}`);
        
        const roomOption = {
            token,
            faviconUrl,
            logoUrl,
            returnUrl: room.returnUrl,
            avatarUrl: roomUrlData?.avatarUrl,
            displayName: roomUrlData?.displayName,
            funcs: this.optionsService.generateFuncs(),
            linkPayload: roomUrlData?.linkPayload
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
            console.log("setRoomPotion",roomOption)
            return await this.optionsService.createOption(roomId, roomOption)
        } else {
            return await this.optionsService.updateOption(roomId, roomOption)
        }
    }

    
   
    async registerUser(projectId: string, userId?: string) {
        const infraUserId = userId ? userId : 'admin'
        Logger.log(`Registering user - Project ID: ${projectId}, Infra User ID: ${infraUserId}`)

        const userExist = await this.usersService.findUserByProjectIdAndInfraUserId(projectId, infraUserId)

        if (userExist) {
            Logger.log(`User already exists - Infra User ID: ${infraUserId}`)
            return userExist
        }

        Logger.log(`User not found, creating new user - Infra User ID: ${infraUserId}`)

        const { reticulumId } = await this.reticulumService.getAccountId(projectId, userId)
        Logger.log(`Retrieved Reticulum ID: ${reticulumId} for Infra User ID: ${infraUserId}`)

        const createUser = {
            projectId: projectId,
            infraUserId: infraUserId,
            reticulumId
        }

        const newUser = await this.usersService.createUser(createUser)
        Logger.log(`User created successfully - Infra User ID: ${infraUserId}, Reticulum ID: ${reticulumId}`)

        return newUser
    }

    async getRoomLogs(roomId: string, roomLogQuery: RoomLogsQueryDto ) {
        if (roomLogQuery.userId) {
            return await this.roomLogsRepository.findByInfraUserId(roomId, roomLogQuery.userId)  
        }              
        return await this.roomLogsRepository.findByRoomId(roomId)        
    }

    async countRoomAccesses() {
        return await this.roomLogsRepository.findByCode(LogCode.ROOM_JOIN);
    }
}
