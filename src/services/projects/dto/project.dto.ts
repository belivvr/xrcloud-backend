import { Project } from '../entities'

export class ProjectDto {
    id: string
    name: string
    webhookUrl: string
    createdAt: Date
    updatedAt: Date
    faviconUrl: string
    logoUrl: string

    constructor(project: Project) {
        const { id, name, webhookUrl, createdAt, updatedAt } = project

        Object.assign(this, { id, name, webhookUrl, createdAt, updatedAt })
    }
}
