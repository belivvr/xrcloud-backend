import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { Assert, generateUUID, updateIntersection } from 'src/common'
import { FAVICON, LOGO } from 'src/common/constants'
import { FileStorageService } from 'src/infra/file-storage/file-storage.service'
import { UploadedFilesType } from '../manage-asset/types'
import { CreateProjectDto, ProjectDto, ProjectsQueryDto, UpdateProjectDto } from './dto'
import { Project } from './entities'
import { FILE_TYPES } from './interfaces'
import { ProjectsRepository } from './projects.repository'

@Injectable()
export class ProjectsService {
    constructor(
        private readonly projectsRepository: ProjectsRepository,
        private readonly fileStorageService: FileStorageService
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
            uploadedFavicon = await this.fileStorageService.saveFile(faviconFile.buffer, faviconKey)

            await this.fileStorageService.saveFile(logoFile.buffer, logoKey)
        } catch (error) {
            if (uploadedFavicon) {
                await this.fileStorageService.removeFile(faviconKey)
            }

            throw new InternalServerErrorException(`Failed to upload files: ${error.message}.`)
        }

        const createProject = {
            ...createProjectDto,
            faviconId: faviconId,
            logoId: logoId,
            adminId: adminId
        }

        const project = await this.projectsRepository.create(createProject)

        return this.getProjectDto(project.id)
    }

    async findProjects(queryDto: ProjectsQueryDto, adminId: string) {
        const projects = await this.projectsRepository.find(queryDto, adminId)

        if (projects.items.length === 0) {
            return { ...projects, items: [] }
        }

        const dtos = await Promise.all(projects.items.map((project) => this.getProjectDto(project.id)))

        return { ...projects, items: dtos }
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

                await this.fileStorageService.saveFile(file.buffer, fileKey)
            }
        }

        const updateProject = {
            ...updateProjectDto
        }

        const updatedProject = updateIntersection(project, updateProject)

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

    async findProjectByLabel(label: string) {
        const projects = await this.projectsRepository.findByLabel(label)

        return projects
    }

    async findProjectByAdminIdAndLabel(adminId: string, label: string) {
        const project = await this.projectsRepository.findByAdminIdAndLabel(adminId, label)

        return project
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

        const dto = new ProjectDto(project)
        dto.faviconUrl = `${faviconUrl}.ico`
        dto.logoUrl = `${logoUrl}.jpg`

        return dto
    }

    private generateFileKey(fileId: string, fileType: string) {
        const prePath = fileId.slice(0, 3)

        const typeDetails = FILE_TYPES.get(fileType)

        if (!typeDetails) {
            throw new BadRequestException(`Unsupported file type: ${fileType}.`)
        }

        return `${typeDetails.type}/${prePath}/${fileId}.${typeDetails.extension}`
    }
}
