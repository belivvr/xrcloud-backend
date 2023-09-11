import { Project } from '../entities'

export class ProjectDto {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    faviconUrl: string
    logoUrl: string
    sceneCreationUrl: string

    constructor(project: Project) {
        const { id, name, createdAt, updatedAt } = project

        Object.assign(this, { id, name, createdAt, updatedAt })
    }
}
