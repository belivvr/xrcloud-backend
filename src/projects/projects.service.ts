import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { generateUUID, makeProjectKey, updateIntersection } from 'src/common'
import { FileStorageService } from 'src/file-storage'
import { CreateProjectDto, ProjectDto, QueryDto, UpdateProjectDto } from './dto'
import { Project } from './entities'
import { FILE_TYPES } from './interfaces'
import { ProjectsRepository } from './projects.repository'
import { UploadedFilesType } from './types'

@Injectable()
export class ProjectsService {
    constructor(
        private readonly projectsRepository: ProjectsRepository,
        private readonly fileStorageService: FileStorageService
    ) {}

    async create(createProjectDto: CreateProjectDto, files: UploadedFilesType, adminId: string) {
        const faviconFile = files['favicon'][0]
        const logoFile = files['logo'][0]

        const faviconId = generateUUID()
        const logoId = generateUUID()

        const faviconKey = this.generateFileKey(faviconId, 'favicon')
        const logoKey = this.generateFileKey(logoId, 'logo')

        let uploadedFavicon

        try {
            uploadedFavicon = await this.fileStorageService.save(faviconFile.buffer, faviconKey)

            await this.fileStorageService.save(logoFile.buffer, logoKey)
        } catch (error) {
            if (uploadedFavicon) {
                await this.fileStorageService.remove(faviconKey)
            }

            throw new InternalServerErrorException(`Failed to upload files: ${error.message}`)
        }

        const createProject = {
            ...createProjectDto,
            faviconId: faviconId,
            logoId: logoId,
            adminId: adminId
        }

        const project = await this.projectsRepository.create(createProject)

        return project
    }

    async findProjects(queryDto: QueryDto, adminId: string) {
        const projects = await this.projectsRepository.find(queryDto, adminId)

        return projects
    }

    async update(projectId: string, updateProjectDto: UpdateProjectDto, files: UploadedFilesType) {
        const project = await this.getProject(projectId)

        for (const fieldName of ['favicon', 'logo'] as const) {
            if (files[fieldName] && files[fieldName][0]) {
                const file = files[fieldName][0]

                let fileKey

                if (fieldName === 'favicon') {
                    fileKey = this.generateFileKey(project.faviconId, fieldName)
                } else if (fieldName === 'logo') {
                    fileKey = this.generateFileKey(project.logoId, fieldName)
                }

                await this.fileStorageService.save(file.buffer, fileKey)
            }
        }

        const updateProject = {
            ...updateProjectDto
        }

        const updatedProject = updateIntersection(project, updateProject)

        return await this.projectsRepository.update(updatedProject)
    }

    async generateKey(projectId: string) {
        const project = await this.getProject(projectId)

        const projectKey = makeProjectKey(project.id, project.name)

        const updateProject = {
            projectKey: projectKey
        }

        const updatedProject = updateIntersection(project, updateProject)

        await this.projectsRepository.update(updatedProject)

        return { projectKey: projectKey }
    }

    async remove(projectId: string) {
        const project = await this.getProject(projectId)

        await this.projectsRepository.remove(project)
    }

    async getProject(projectId: string): Promise<Project> {
        const project = await this.projectsRepository.findById(projectId)

        if (!project) {
            throw new NotFoundException(`Project with ID "${projectId}" not found`)
        }

        return project
    }

    async getProjectDto(projectId: string) {
        const project = await this.getProject(projectId)

        const faviconUrl = this.fileStorageService.getFileUrl(project.faviconId, 'favicon')
        const logoUrl = this.fileStorageService.getFileUrl(project.logoId, 'logo')

        const dto = new ProjectDto(project)
        dto.faviconUrl = `${faviconUrl}.ico`
        dto.logoUrl = `${logoUrl}.jpg`

        return dto
    }

    async projectExists(projectId: string): Promise<boolean> {
        return this.projectsRepository.exist(projectId)
    }

    private generateFileKey(fileId: string, fileType: string) {
        const prePath = fileId.slice(0, 3)

        const typeDetails = FILE_TYPES.get(fileType)

        if (!typeDetails) {
            throw new BadRequestException(`Unsupported file type: ${fileType}`)
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
