import { Scene } from '../entities'

export class SceneDto {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    creator: string
    thumbnailUrl: string
    sceneModificationUrl: string

    constructor(scene: Scene) {
        const { id, name, createdAt, updatedAt, creator } = scene

        Object.assign(this, { id, name, createdAt, updatedAt, creator })
    }
}
