import { Injectable } from '@nestjs/common'
import { CacheService, convertTimeToSeconds } from 'src/common'
import { RoomsService } from 'src/rooms/rooms.service'
import { ScenesService } from 'src/scenes/scenes.service'
import { CreateEventDto, EventType } from './dto'
import { CreateSceneData, JoinRoomData, ExitRoomData, UpdateSceneData, UserDetails } from './interfaces'
import { EventConfigService } from './services'

@Injectable()
export class EventsService {
    constructor(
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService,
        private readonly cacheService: CacheService,
        private readonly configService: EventConfigService
    ) {}

    async createEvent(createEventDto: CreateEventDto) {
        const eventType = createEventDto.type

        switch (eventType) {
            case EventType.SCENE_CREATED: {
                const { projectId, sceneId, extra } = createEventDto

                const createSceneData: CreateSceneData = {
                    projectId,
                    sceneId,
                    extra
                }

                await this.createScene(createSceneData)

                break
            }

            case EventType.SCENE_UPDATED: {
                const { sceneId } = createEventDto

                const updateSceneData: UpdateSceneData = {
                    sceneId
                }

                await this.updateScene(updateSceneData)

                break
            }

            case EventType.ROOM_JOIN: {
                const { roomId, userId, sessionId, eventTime } = createEventDto

                const joinRoomData: JoinRoomData = {
                    roomId,
                    userId,
                    sessionId,
                    eventTime
                }

                await this.joinRoom(joinRoomData)

                break
            }

            case EventType.ROOM_EXIT: {
                const { sessionId, eventTime } = createEventDto

                const exitRoomData: ExitRoomData = {
                    sessionId,
                    eventTime
                }

                await this.exitRoom(exitRoomData)

                break
            }
        }
    }

    // TODO: outdoor > events
    async createScene(createSceneData: CreateSceneData) {
        const { projectId: infraProjectId, sceneId: infraSceneId, extra: extraArgs } = createSceneData

        const extraObj: Record<string, string> = {}

        if (extraArgs) {
            const extraParts = extraArgs.split(',')

            for (const part of extraParts) {
                const [key, value] = part.split(':')
                if (key && value) {
                    extraObj[key] = value
                }
            }
        }

        const createData = {
            projectId: extraObj.projectId,
            infraProjectId: infraProjectId,
            infraSceneId: infraSceneId
        }

        await this.scenesService.createScene(createData)
    }

    // TODO: outdoor > events
    async updateScene(updateSceneData: UpdateSceneData) {
        const { sceneId: infraSceneId } = updateSceneData

        const updateData = {
            infraSceneId: infraSceneId
        }

        await this.scenesService.updateScene(updateData)
    }

    async joinRoom(joinRoomData: JoinRoomData) {
        // const { roomId: infraRoomId, userId: infraUserId, sessionId, eventTime } = joinRoomData

        // const { roomDetailsKey, roomDetails } = await this.roomsService.getRoomDetails(sessionId)

        // const joinData = {
        //     roomId: roomDetails.roomId,
        //     sessionId: sessionId,
        //     infraUserId: infraUserId,
        //     type: EventType.ROOM_JOIN,
        //     createdAt: new Date(eventTime)
        // }

        //// roomAccessRepository
        // await this.repository.create(joinData)

        // const userDetails: UserDetails = {
        //     infraUserId: infraUserId
        // }

        // roomDetails.userCount++
        // roomDetails.users.push(userDetails)

        // console.log(`User(${infraUserId}) joined the room(${infraRoomId}) at ${eventTime}`)
    }

    async exitRoom(exitRoomData: ExitRoomData) {
        // const { sessionId, eventTime } = exitRoomData

        //// roomAccessRepository
        // const accessLog = await this.repository.findBySessionId(sessionId)

        // const exitLogData = {
        //     ...accessLog,
        //     type: EventType.ROOM_EXIT,
        //     createdAt: new Date(eventTime)
        // }

        //// roomAccessRepository
        // await this.repository.create(exitLogData)

        // const { roomDetailsKey, roomDetails } = await this.roomsService.getRoomDetails(sessionId)

        // const userDetails: UserDetails = {
        //     infraUserId: roomDetails.infraUserId
        // }

        // roomDetails.userCount--
        // roomDetails.users = roomDetails.users.filter((user: UserDetails) => user.infraUserId !== infraUserId)

        // console.log(`User(${infraUserId}) left the room(${infraRoomId}) at ${eventTime}`)
    }

    // TODO
    async setAccessLog() {
        // const expireTime = this.configService.roomDetailsExpiration

        // const convertExpireTime = convertTimeToSeconds(expireTime)

        // await this.cacheService.set(roomDetailsKey, JSON.stringify(roomDetails), convertExpireTime)

        // const createAccessLog = {
        //     type: type,
        //     roomId: infraRoomId,
        //     userId: infraUserId,
        //     createdAt: eventTime
        // }

        // await this.repository.create(createAccessLog)
    }
}
