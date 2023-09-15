import {
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { Assert, CacheService, convertTimeToSeconds, generateUUID, updateIntersection } from 'src/common'
import { FileStorageService } from 'src/infra/file-storage/file-storage.service'
import { ReticulumService } from 'src/infra/reticulum/reticulum.service'
import { DeepPartial } from 'typeorm'
import { ProjectDto, QueryDto } from './dto'
import { Project } from './entities'
import { ProjectConfigService } from './project-config.service'
import { ProjectsRepository } from './projects.repository'

const FAVICON = 'favicon'
const LOGO = 'logo'

@Injectable()
export class ProjectsService {
    constructor(
        private readonly projectsRepository: ProjectsRepository,
        private readonly fileStorageService: FileStorageService,
        private readonly reticulumService: ReticulumService,
        private readonly cacheService: CacheService,
        private readonly configService: ProjectConfigService
    ) {}

    async createProject(createProjectData: DeepPartial<Project>) {
        const project = await this.projectsRepository.create(createProjectData)

        return this.getProjectDto(project.id)
    }

    async findProjects(queryDto: QueryDto, adminId: string) {
        const projects = await this.projectsRepository.find(queryDto, adminId)

        return projects
    }

    async getProject(projectId: string): Promise<Project> {
        const project = await this.projectsRepository.findById(projectId)

        Assert.defined(project, `Project with ID "${projectId}" not found.`)

        return project as Project
    }

    async updateProject(project: Project, updateProjectData: DeepPartial<Project>) {
        const updatedProject = updateIntersection(project, updateProjectData)

        const savedProject = await this.projectsRepository.update(updatedProject)

        Assert.deepEquals(savedProject, updatedProject, 'The result is different from the update request')

        return this.getProjectDto(savedProject.id)
    }

    async removeProject(projectId: string) {
        const project = await this.getProject(projectId)

        await this.projectsRepository.remove(project)
    }

    async findProjectsByAdminId(adminId: string) {
        const projects = await this.projectsRepository.findByAdminId(adminId)

        return projects
    }

    async projectExists(projectId: string): Promise<boolean> {
        return this.projectsRepository.exist(projectId)
    }

    async validateProjectExists(projectId: string) {
        const projectExists = await this.projectExists(projectId)

        if (!projectExists) {
            throw new NotFoundException(`Project with ID "${projectId}" not found.`)
        }
    }

    async getProjectDto(projectId: string) {
        const project = await this.getProject(projectId)

        const faviconUrl = this.fileStorageService.getFileUrl(project.faviconId, FAVICON)
        const logoUrl = this.fileStorageService.getFileUrl(project.logoId, LOGO)

        const sceneCreationUrl = await this.getSceneCreationUrl(projectId)

        const dto = new ProjectDto(project)
        dto.faviconUrl = `${faviconUrl}.ico`
        dto.logoUrl = `${logoUrl}.jpg`
        dto.sceneCreationUrl = sceneCreationUrl

        return dto
    }

    async getSceneCreationUrl(projectId: string) {
        const token = await this.reticulumService.getAdminToken(projectId)

        const extraArgs = {
            projectId: projectId
        }

        const { url, options } = await this.reticulumService.getSceneCreationInfo(token, extraArgs)

        const optionId = generateUUID()

        const key = `option:${optionId}`

        const expireTime = convertTimeToSeconds(this.configService.sceneOptionExpiration)

        await this.cacheService.set(key, JSON.stringify(options), expireTime)

        const sceneCreationUrl = `${url}?optId=${optionId}`

        return sceneCreationUrl
    }

    async restrictProjectCreation(adminId: string) {
        const projects = await this.projectsRepository.findByAdminId(adminId)

        if (projects.length > 0) {
            return false
        }

        return true
    }
}
