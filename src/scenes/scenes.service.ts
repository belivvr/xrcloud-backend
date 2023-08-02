import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { updateIntersection } from 'src/common'
import { ReticulumService } from 'src/reticulum'
import { UsersService } from 'src/users'
import {
    CreateSceneDto,
    GetSceneCreationUrlDto,
    GetSceneModificationUrlDto,
    QueryDto,
    SceneDto,
    UpdateSceneDto
} from './dto'
import { ScenesRepository } from './scenes.repository'
import { Scene } from './entities'

@Injectable()
export class ScenesService {
    constructor(
        private readonly scenesRepository: ScenesRepository,
        private readonly usersService: UsersService,
        private readonly reticulumService: ReticulumService
    ) {}

    async create(createSceneDto: CreateSceneDto) {
        const { projectId: infraProjectId, sceneId: infraSceneId } = createSceneDto

        if (await this.infraSceneExists(infraSceneId)) {
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

    async getSceneCreationUrl(getSceneCreationUrlDto: GetSceneCreationUrlDto) {
        const { personalId, projectId } = getSceneCreationUrlDto

        const token = await this.usersService.getUserToken(projectId, personalId)

        const url = await this.reticulumService.getSceneCreationUrl(token)

        return { sceneCreationUrl: url }
    }

    async getSceneModificationUrl(getSceneModificationUrlDto: GetSceneModificationUrlDto) {
        const { personalId, projectId, sceneId } = getSceneModificationUrlDto

        const scene = await this.getScene(sceneId)

        const token = await this.usersService.getUserToken(projectId, personalId)

        const url = await this.reticulumService.getSceneModificationUrl(scene.infraProjectId, token)

        return { sceneModificationUrl: url }
    }

    async findScenes(projectId: string, queryDto: QueryDto) {
        const scenes = await this.scenesRepository.find(projectId, queryDto)

        return scenes
    }

    async getScene(sceneId: string): Promise<Scene> {
        const scene = await this.scenesRepository.findById(sceneId)

        if (!scene) {
            throw new NotFoundException(`Scene with ID "${sceneId}" not found`)
        }

        return scene
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

    async sceneExists(sceneId: string): Promise<boolean> {
        return this.scenesRepository.exist(sceneId)
    }

    async infraSceneExists(infraSceneId: string): Promise<boolean> {
        return this.scenesRepository.sceneExists(infraSceneId)
    }
}
