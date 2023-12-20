import { Injectable, Logger } from '@nestjs/common'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { ProjectsService } from '../projects/projects.service'
import { RoomsService } from '../rooms/rooms.service'
import { RoomAccessType } from '../rooms/types'
import { UsersService } from '../users/users.service'
import { HubEventDto, HubEventName, SpokeEventDto, SpokeEventName } from './dto'
import {
    CallbackData,
    CreateSceneData,
    ExitRoomData,
    JoinRoomData,
    UpdateSceneData,
    WebhookData
} from './interfaces'

@Injectable()
export class EventsService {
    constructor(
        private readonly usersService: UsersService,
        private readonly projectsService: ProjectsService,
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService
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
            infraSceneId: infraSceneId,
            creator: extraObj.creator
        }

        const scene = await this.scenesService.createScene(createData)

        if (extraObj.callback) {
            const callbackData = {
                sceneId: scene.id,
                callbackUrl: extraObj.callback
            }

            await this.callback(callbackData)
        }
    }

    async updateScene(updateSceneData: UpdateSceneData) {
        const { sceneId: infraSceneId } = updateSceneData

        const updateData = {
            infraSceneId: infraSceneId
        }

        await this.scenesService.updateScene(updateData)
    }

    private async callback(callbackData: CallbackData) {
        const { sceneId, callbackUrl } = callbackData

        const fetchBody = {
            sceneId
        }

        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fetchBody)
        }

        const response = await fetch(decodeURIComponent(callbackUrl), fetchOptions)

        if (300 <= response.status) {
            const errorData = await response.text()

            Logger.error(`Failed to fetch for callbackUrl: "${callbackUrl}"`, errorData)
        }
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

        const savedRoomAccess = await this.roomsService.createRoomAccess(createRoomAccess)

        const project = await this.projectsService.getProject(room.projectId)

        if (project.webhookUrl) {
            const webhookData = {
                webhookUrl: project.webhookUrl,
                infraUserId: savedRoomAccess.infraUserId,
                roomId: savedRoomAccess.roomId,
                roomAccessType: RoomAccessType.Join,
                roomAccessTime: savedRoomAccess.joinedAt
            }

            await this.webhook(webhookData)
        }
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

        const savedRoomAccess = await this.roomsService.updateRoomAccess(roomAccess.id, updateRoomAccess)

        const room = await this.roomsService.getRoom(savedRoomAccess.roomId)

        const project = await this.projectsService.getProject(room.projectId)

        if (project.webhookUrl) {
            const webhookData = {
                webhookUrl: project.webhookUrl,
                infraUserId: savedRoomAccess.infraUserId,
                roomId: savedRoomAccess.roomId,
                roomAccessType: RoomAccessType.Exit,
                roomAccessTime: savedRoomAccess.exitedAt
            }

            await this.webhook(webhookData)
        }
    }

    private async webhook(webhookData: WebhookData) {
        const { webhookUrl, ...restWebhookData } = webhookData

        const fetchBody = {
            ...restWebhookData
        }

        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fetchBody)
        }

        const response = await fetch(decodeURIComponent(webhookUrl), fetchOptions)

        if (300 <= response.status) {
            const errorData = await response.text()

            Logger.error(`Failed to fetch for webhookUrl: "${webhookUrl}"`, errorData)
        }
    }
}
