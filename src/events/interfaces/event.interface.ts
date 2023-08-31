export interface CreateSceneData {
    projectId: string
    sceneId: string
    extra: string
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

export interface UserDetails {
    infraUserId: string
}

export interface RoomDetails {
    projectId: string
    roomId: string
    userCount: number
    users: UserDetails[]
}
