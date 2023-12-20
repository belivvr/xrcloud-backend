import { RoomAccessType } from 'src/services/rooms/types'

export interface CreateSceneData {
    projectId: string
    sceneId: string
    extra: string
    callback?: string
}

export interface CallbackData {
    sceneId: string
    callbackUrl: string
}

export interface UpdateSceneData {
    sceneId: string
}

export interface JoinRoomData {
    roomId: string
    userId: string
    sessionId: string
    eventTime: string
}

export interface ExitRoomData {
    sessionId: string
    eventTime: string
}

export interface WebhookData {
    webhookUrl: string
    infraUserId?: string
    roomId?: string
    roomAccessType?: RoomAccessType
    roomAccessTime?: Date
}
