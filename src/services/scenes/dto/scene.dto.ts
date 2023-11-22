import { Scene } from '../entities'

export class SceneDto {
    id: string
    name: string
    tag: string
    createdAt: Date
    updatedAt: Date
    thumbnailUrl: string
    sceneModificationUrl: string

    constructor(scene: Scene) {
        const { id, name, tag, createdAt, updatedAt } = scene

        Object.assign(this, { id, name, tag, createdAt, updatedAt })
    }
}
