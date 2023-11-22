import { Scene } from '../entities'

export class SceneDto {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    thumbnailUrl: string
    sceneModificationUrl: string

    constructor(scene: Scene) {
        const { id, name, createdAt, updatedAt } = scene

        Object.assign(this, { id, name, createdAt, updatedAt })
    }
}
