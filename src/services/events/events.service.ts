import { Injectable, Logger } from '@nestjs/common'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { CnuEventService } from '../cnu-event'
import { RoomsService } from '../rooms/rooms.service'
import { UsersService } from '../users/users.service'
import { HubEventDto, HubEventName, SpokeEventDto, SpokeEventName } from './dto'
import { CreateSceneData, ExitRoomData, JoinRoomData, UpdateSceneData } from './interfaces'

@Injectable()
export class EventsService {
    constructor(
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService,
        private readonly cnuEventService: CnuEventService,
        private readonly usersService: UsersService
    ) {}

    /*
     * Spoke
     */
    async handleSpokeEvent(spokeEventDto: SpokeEventDto) {
        const eventName = spokeEventDto.eventName

        switch (eventName) {
            case SpokeEventName.SCENE_CREATED: {
                const { projectId, sceneId, extra } = spokeEventDto

                const createSceneData: CreateSceneData = {
                    projectId,
                    sceneId,
                    extra
                }

                await this.createScene(createSceneData)

                break
            }

            case SpokeEventName.SCENE_UPDATED: {
                const { sceneId } = spokeEventDto

                const updateSceneData: UpdateSceneData = {
                    sceneId
                }

                await this.updateScene(updateSceneData)

                break
            }
        }
    }

    async createScene(createSceneData: CreateSceneData) {
        const { projectId: infraProjectId, sceneId: infraSceneId, extra: extraArgs } = createSceneData

        const extraObj: Record<string, string> = {}

        if (extraArgs) {
            const extraParts = extraArgs.split('&')

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

        const scene = await this.scenesService.createScene(createData)

        if (extraObj.extraData && extraObj.extraData === 'cnu') {
            const createCnuEventData = {
                creator: extraObj.creator,
                projectId: extraObj.projectId,
                sceneId: scene.id
            }

            await this.cnuEventService.createCnuEvent(createCnuEventData)
        }
    }

    async updateScene(updateSceneData: UpdateSceneData) {
        const { sceneId: infraSceneId } = updateSceneData

        const updateData = {
            infraSceneId: infraSceneId
        }

        await this.scenesService.updateScene(updateData)
    }

    /*
     * Hub
     */
    async handleHubEvent(hubEventDto: HubEventDto) {
        const eventName = hubEventDto.type

        switch (eventName) {
            case HubEventName.ROOM_JOIN: {
                const { roomId, userId, sessionId, eventTime } = hubEventDto

                const joinRoomData: JoinRoomData = {
                    roomId,
                    userId,
                    sessionId,
                    eventTime
                }

                await this.joinRoom(joinRoomData)

                break
            }

            case HubEventName.ROOM_EXIT: {
                const { sessionId, eventTime } = hubEventDto

                const exitRoomData: ExitRoomData = {
                    sessionId,
                    eventTime
                }

                await this.exitRoom(exitRoomData)

                break
            }
        }
    }

    async joinRoom(joinRoomData: JoinRoomData) {
        const { roomId: infraRoomId, userId: reticulumId, sessionId, eventTime } = joinRoomData

        const room = await this.roomsService.findRoomByInfraRoomId(infraRoomId)

        if (!room) {
            Logger.error('Join room event: Failed to find room')

            return
        }

        const user = await this.usersService.findUserByReticulumId(reticulumId)

        if (!user) {
            Logger.error('Join room event: Failed to find user', reticulumId)

            return
        }

        const createRoomAccess = {
            sessionId: sessionId,
            joinedAt: new Date(eventTime),
            roomId: room.id,
            infraUserId: user.infraUserId
        }

        await this.roomsService.createRoomAccess(createRoomAccess)
    }

    async exitRoom(exitRoomData: ExitRoomData) {
        const { sessionId, eventTime } = exitRoomData

        const roomAccess = await this.roomsService.findRoomAccessBySessionId(sessionId)

        if (!roomAccess) {
            Logger.error('Exit room event: Failed to find room access')

            return
        }

        const updateRoomAccess = {
            exitedAt: new Date(eventTime)
        }

        await this.roomsService.updateRoomAccess(roomAccess.id, updateRoomAccess)
    }
}
