import { Scene } from '../entities'

export class SceneDto {
    id: string
    name: string
    tag: string
    thumbnailUrl: string
    sceneModificationUrl: string

    constructor(scene: Scene) {
        const { id, name, tag } = scene

        Object.assign(this, { id, name, tag })
    }
}
