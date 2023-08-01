import { Project } from '../entities'

export class ProjectDto {
    id: string
    name: string
    projectKey: string
    createdAt: Date
    updatedAt: Date
    faviconUrl: string
    logoUrl: string

    constructor(project: Project) {
        const { id, name, projectKey, createdAt, updatedAt } = project

        Object.assign(this, { id, name, projectKey, createdAt, updatedAt })
    }
}
