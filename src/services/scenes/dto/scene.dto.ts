import { Scene } from '../entities'

export class SceneDto {
    id: string
    name: string
    thumbnailUrl: string
    sceneModificationUrl: string

    constructor(scene: Scene) {
        const { id, name } = scene

        Object.assign(this, { id, name })
    }
}
