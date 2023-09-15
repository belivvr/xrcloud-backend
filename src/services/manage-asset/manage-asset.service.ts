import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import { generateUUID, getSlug } from 'src/common'
import { FileStorageService } from 'src/infra/file-storage/file-storage.service'
import { ReticulumService } from 'src/infra/reticulum/reticulum.service'
import { ProjectsService } from 'src/services/projects/projects.service'
import { RoomDto } from 'src/services/rooms/dto'
import { RoomsService } from 'src/services/rooms/rooms.service'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { SubscriptionsService } from 'src/services/subscriptions/subscriptions.service'
import {
    CreateProjectDto,
    CreateRoomDto,
    CreateSceneDto,
    UpdateProjectDto,
    UpdateRoomDto,
    UpdateSceneDto
} from './dto'
import { FILE_TYPES } from './interfaces'
import { UploadedFilesType } from './types'

const FAVICON = 'favicon'
const LOGO = 'logo'

@Injectable()
export class ManageAssetService {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService,
        private readonly fileStorageService: FileStorageService,
        private readonly reticulumService: ReticulumService,
        private readonly subscriptionsService: SubscriptionsService
    ) {}

    /*
     * projects
     */
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

        return await this.projectsService.createProject(createProject)
    }

    async updateProject(projectId: string, updateProjectDto: UpdateProjectDto, files: UploadedFilesType) {
        const project = await this.projectsService.getProject(projectId)

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

        return await this.projectsService.updateProject(project, updateProject)
    }

    /*
     * scenes
     */
    async createScene(createSceneDto: CreateSceneDto) {
        const { projectId, infraProjectId, infraSceneId } = createSceneDto

        await this.projectsService.validateProjectExists(projectId)

        if (await this.scenesService.infraSceneExists(infraSceneId)) {
            throw new ConflictException(`Scene with ID "${infraSceneId}" already exists.`)
        }

        const infraScene = await this.reticulumService.getScene(infraSceneId)

        const thumbnailId = await this.reticulumService.getThumbnailId(infraScene.screenshot_owned_file_id)

        const createScene = {
            name: infraScene.name,
            infraSceneId: infraSceneId,
            infraProjectId: infraProjectId,
            thumbnailId: thumbnailId,
            projectId: projectId
        }

        await this.scenesService.createScene(createScene)
    }

    async updateScene(updateSceneDto: UpdateSceneDto) {
        const { infraSceneId } = updateSceneDto

        const scene = await this.scenesService.findSceneByInfraSceneId(infraSceneId)

        const infraScene = await this.reticulumService.getScene(infraSceneId)

        const thumbnailId = await this.reticulumService.getThumbnailId(infraScene.screenshot_owned_file_id)

        const updateScene = {
            name: infraScene.name,
            thumbnailId: thumbnailId
        }

        return await this.scenesService.updateScene(scene, updateScene)
    }

    /*
     * rooms
     */
    async createRoom(createRoomDto: CreateRoomDto) {
        const { projectId, sceneId, ...createData } = createRoomDto

        await this.projectsService.validateProjectExists(projectId)

        const countRooms = await this.roomsService.countRoomsByProjectId(projectId)

        await this.subscriptionsService.validateRoomCreation(sceneId, countRooms, createData.size)

        const scene = await this.scenesService.getScene(sceneId)

        const token = await this.reticulumService.getAdminToken(projectId)

        const createRoomData = {
            ...createData,
            token: token
        }

        const infraRoom = await this.reticulumService.createRoom(scene.infraSceneId, createRoomData)

        const slug = getSlug(infraRoom.url)

        const createRoom = {
            ...createData,
            slug: slug,
            infraRoomId: infraRoom.hub_id,
            thumbnailId: scene.thumbnailId,
            projectId: projectId,
            sceneId: scene.id
        }

        return await this.roomsService.createRoom(createRoom)
    }

    async updateRoom(roomId: string, updateRoomDto: UpdateRoomDto) {
        const room = await this.roomsService.getRoom(roomId)

        const roomDto = new RoomDto(room)

        await this.subscriptionsService.validateRoomUpdate(roomDto, updateRoomDto.size)

        const token = await this.reticulumService.getAdminToken(room.projectId)

        const updateRoomData = {
            ...updateRoomDto,
            token: token
        }

        const { hubs: updatedInfraRoom } = await this.reticulumService.updateRoom(
            room.infraRoomId,
            updateRoomData
        )

        const updateRoom = {
            ...updateRoomDto,
            slug: updatedInfraRoom[0].slug
        }

        return await this.roomsService.updateRoom(room, updateRoom)
    }

    /*
     *
     */
    private generateFileKey(fileId: string, fileType: string) {
        const prePath = fileId.slice(0, 3)

        const typeDetails = FILE_TYPES.get(fileType)

        if (!typeDetails) {
            throw new BadRequestException(`Unsupported file type: ${fileType}.`)
        }

        return `${typeDetails.type}/${prePath}/${fileId}.${typeDetails.extension}`
    }
}
