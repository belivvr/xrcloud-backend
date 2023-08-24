import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { Assert, generateUUID, updateIntersection } from 'src/common'
import { FileStorageService } from 'src/file-storage'
import { ScenesService } from 'src/scenes'
import { CreateProjectDto, ProjectDto, QueryDto, UpdateProjectDto } from './dto'
import { Project } from './entities'
import { FILE_TYPES } from './interfaces'
import { ProjectsRepository } from './projects.repository'
import { UploadedFilesType } from './types'

const FAVICON = 'favicon'
const LOGO = 'logo'

@Injectable()
export class ProjectsService {
    constructor(
        private readonly projectsRepository: ProjectsRepository,
        private readonly fileStorageService: FileStorageService,
        private readonly scenesService: ScenesService
    ) {}

    async createProject(createProjectDto: CreateProjectDto, files: UploadedFilesType, adminId: string) {
        const faviconFile = files[FAVICON][0]
        const logoFile = files[LOGO][0]

        const faviconId = generateUUID()
        const logoId = generateUUID()

        const faviconKey = this.generateFileKey(faviconId, FAVICON)
        const logoKey = this.generateFileKey(logoId, LOGO)

        let uploadedFavicon

        try {
            uploadedFavicon = await this.fileStorageService.save(faviconFile.buffer, faviconKey)

            await this.fileStorageService.save(logoFile.buffer, logoKey)
        } catch (error) {
            if (uploadedFavicon) {
                await this.fileStorageService.remove(faviconKey)
            }

            throw new InternalServerErrorException(`Failed to upload files: ${error.message}.`)
        }

        const createProject = {
            ...createProjectDto,
            faviconId: faviconId,
            logoId: logoId,
            adminId: adminId
        }

        return await this.projectsRepository.create(createProject)
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

    async updateProject(projectId: string, updateProjectDto: UpdateProjectDto, files: UploadedFilesType) {
        const project = await this.getProject(projectId)

        for (const fieldName of [FAVICON, LOGO] as const) {
            if (files[fieldName] && files[fieldName][0]) {
                const file = files[fieldName][0]

                let fileKey

                if (fieldName === FAVICON) {
                    fileKey = this.generateFileKey(project.faviconId, fieldName)
                } else if (fieldName === LOGO) {
                    fileKey = this.generateFileKey(project.logoId, fieldName)
                }

                await this.fileStorageService.save(file.buffer, fileKey)
            }
        }

        const updateProject = {
            ...updateProjectDto
        }

        const updatedProject = updateIntersection(project, updateProject)

        const savedProject = await this.projectsRepository.update(updatedProject)

        Assert.deepEquals(savedProject, updatedProject, 'The result is different from the update request')

        return savedProject
    }

    async removeProject(projectId: string) {
        const project = await this.getProject(projectId)

        await this.projectsRepository.remove(project)
    }

    async getProjectDto(projectId: string) {
        const project = await this.getProject(projectId)

        const faviconUrl = this.fileStorageService.getFileUrl(project.faviconId, 'favicon')
        const logoUrl = this.fileStorageService.getFileUrl(project.logoId, 'logo')
        const sceneCreationUrl = await this.scenesService.getSceneCreationUrl(projectId)

        const dto = new ProjectDto(project)
        dto.faviconUrl = `${faviconUrl}.ico`
        dto.logoUrl = `${logoUrl}.jpg`
        dto.sceneCreationUrl = sceneCreationUrl

        return dto
    }

    async projectExists(projectId: string): Promise<boolean> {
        return this.projectsRepository.exist(projectId)
    }

    private generateFileKey(fileId: string, fileType: string) {
        const prePath = fileId.slice(0, 3)

        const typeDetails = FILE_TYPES.get(fileType)

        if (!typeDetails) {
            throw new BadRequestException(`Unsupported file type: ${fileType}.`)
        }

        return `${typeDetails.type}/${prePath}/${fileId}.${typeDetails.extension}`
    }

    async restrictProjectCreation(adminId: string) {
        const project = await this.projectsRepository.findByAdminId(adminId)

        if (project) {
            return false
        }

        return true
    }
}
