
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
