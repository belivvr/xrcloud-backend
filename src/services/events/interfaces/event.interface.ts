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
    ip: string
}

export interface ExitRoomData {
    sessionId: string
    eventTime: string
    ip: string
}

export interface ClickEventData {
    roomId: string
    userId: string
    eventTime: string
    eventAction: string
    ip: string
}

export interface WebhookData {
    ip: string
    webhookUrl: string
    roomId?: string
    infraUserId?: string
    roomAccessType?: RoomAccessType
    roomAccessTime?: Date
    eventAction?: string
}
