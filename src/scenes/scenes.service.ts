import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { updateIntersection } from 'src/common'
import { ReticulumService } from 'src/reticulum'
import { UsersService } from 'src/users'
import {
    CreateSceneDto,
    GetModifySceneUrlDto,
    GetSceneUrlDto,
    QueryDto,
    SceneDto,
    UpdateSceneDto
} from './dto'
import { ScenesRepository } from './scenes.repository'

@Injectable()
export class ScenesService {
    constructor(
        private readonly scenesRepository: ScenesRepository,
        private readonly usersService: UsersService,
        private readonly reticulumService: ReticulumService
    ) {}

    async create(createSceneDto: CreateSceneDto) {
        const { projectId: infraProjectId, sceneId: infraSceneId } = createSceneDto

        if (await this.sceneExists(infraSceneId)) {
            throw new ConflictException(`Scene with ID "${infraSceneId}" already exists`)
        }

        const infraScene = await this.reticulumService.getScene(infraSceneId)

        const thumbnailId = await this.reticulumService.getThumbnailId(infraScene.screenshot_owned_file_id)

        const user = await this.usersService.findByInfraUserId(infraScene.account_id)

        const createScene = {
            name: infraScene.name,
            infraSceneId: infraSceneId,
            infraProjectId: infraProjectId,
            thumbnailId: thumbnailId,
            projectId: user.projectId,
            ownerId: user.id
        }

        await this.scenesRepository.create(createScene)
    }

    async getNewSceneUrl(projectId: string, getSceneUrlDto: GetSceneUrlDto) {
        const { personalId } = getSceneUrlDto

        const token = await this.usersService.getUserToken(projectId, personalId)

        const url = await this.reticulumService.getNewScene(token)

        return { newSceneUrl: url }
    }

    async getModifySceneUrl(projectId: string, getModifySceneUrlDto: GetModifySceneUrlDto) {
        const { personalId, sceneId } = getModifySceneUrlDto

        const scene = await this.getScene(sceneId)

        const token = await this.usersService.getUserToken(projectId, personalId)

        const url = await this.reticulumService.getModifyScene(scene.infraProjectId, token)

        return { modifySceneUrl: url }
    }

    async findAll(projectId: string, queryDto: QueryDto) {
        const scenes = await this.scenesRepository.findAll(projectId, queryDto)

        return scenes
    }

    async update(updateSceneDto: UpdateSceneDto) {
        const { sceneId: infraSceneId } = updateSceneDto

        const scene = await this.findByInfraSceneId(infraSceneId)

        const infraScene = await this.reticulumService.getScene(infraSceneId)

        const thumbnailId = await this.reticulumService.getThumbnailId(infraScene.screenshot_owned_file_id)

        const updateScene = {
            name: infraScene.name,
            thumbnailId: thumbnailId
        }

        const updatedScene = updateIntersection(scene, updateScene)

        await this.scenesRepository.update(updatedScene)
    }

    async getScene(sceneId: string) {
        const scene = await this.scenesRepository.findById(sceneId)

        if (!scene) {
            throw new NotFoundException(`Scene with ID "${sceneId}" not found`)
        }

        return scene
    }

    async getSceneDto(sceneId: string) {
        const scene = await this.getScene(sceneId)

        const thumbnailUrl = await this.reticulumService.getThumbnailUrl(scene.thumbnailId)

        const dto = new SceneDto(scene)
        dto.thumbnailUrl = thumbnailUrl

        return dto
    }

    async findByInfraSceneId(infraSceneId: string) {
        const scene = await this.scenesRepository.findByInfraUserId(infraSceneId)

        if (!scene) {
            throw new NotFoundException(`Scene with ID "${infraSceneId}" not found`)
        }

        return scene
    }

    async sceneExists(infraSceneId: string): Promise<boolean> {
        return this.scenesRepository.sceneExists(infraSceneId)
    }
}
