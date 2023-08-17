import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { CacheService, convertTimeToSeconds, generateUUID, updateIntersection } from 'src/common'
import { ReticulumService } from 'src/reticulum'
import { CreateSceneDto, QueryDto, SceneDto, UpdateSceneDto } from './dto'
import { Scene } from './entities'
import { ScenesRepository } from './scenes.repository'
import { SceneConfigService } from './services/scene-config.service'

@Injectable()
export class ScenesService {
    constructor(
        private readonly scenesRepository: ScenesRepository,
        private readonly reticulumService: ReticulumService,
        private readonly cacheService: CacheService,
        private readonly configService: SceneConfigService
    ) {}

    async createScene(createSceneDto: CreateSceneDto) {
        const { projectId, infraProjectId, infraSceneId } = createSceneDto

        if (await this.infraSceneExists(infraSceneId)) {
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

        await this.scenesRepository.create(createScene)
    }

    async getSceneCreationUrl(projectId: string) {
        const token = await this.reticulumService.getToken(
            projectId,
            this.configService.sceneOptionExpiration
        )

        const extraArgs = {
            projectId: projectId
        }

        const { url, options } = await this.reticulumService.getSceneCreationInfo(token, extraArgs)

        const optionId = generateUUID()

        const expireTime = convertTimeToSeconds(this.configService.sceneOptionExpiration)

        await this.cacheService.set(optionId, JSON.stringify(options), expireTime)

        const sceneCreationUrl = `${url}?optId=${optionId}`

        return sceneCreationUrl
    }

    async getSceneModificationUrl(projectId: string, sceneId: string) {
        const scene = await this.getScene(sceneId)

        const token = await this.reticulumService.getToken(
            projectId,
            this.configService.sceneOptionExpiration
        )

        const { url, options } = await this.reticulumService.getSceneModificationInfo(
            scene.infraProjectId,
            token
        )

        const optionId = generateUUID()

        const expireTime = convertTimeToSeconds(this.configService.sceneOptionExpiration)

        await this.cacheService.set(optionId, JSON.stringify(options), expireTime)

        const sceneModificationUrl = `${url}?optId=${optionId}`

        return sceneModificationUrl
    }

    async findScenes(projectId: string, queryDto: QueryDto) {
        const scenes = await this.scenesRepository.find(projectId, queryDto)

        return scenes
    }

    async getScene(sceneId: string): Promise<Scene> {
        const scene = await this.scenesRepository.findById(sceneId)

        if (!scene) {
            throw new NotFoundException(`Scene with ID "${sceneId}" not found.`)
        }

        return scene
    }

    async updateScene(updateSceneDto: UpdateSceneDto) {
        const { infraSceneId } = updateSceneDto

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

    async removeScene(sceneId: string) {
        const scene = await this.getScene(sceneId)

        await this.scenesRepository.remove(scene)
    }

    async getSceneDto(sceneId: string) {
        const scene = await this.getScene(sceneId)

        const thumbnailUrl = await this.reticulumService.getThumbnailUrl(scene.thumbnailId)
        const sceneModificationUrl = await this.getSceneModificationUrl(scene.projectId, scene.id)

        const dto = new SceneDto(scene)
        dto.thumbnailUrl = thumbnailUrl
        dto.sceneModificationUrl = sceneModificationUrl

        return dto
    }

    async findByInfraSceneId(infraSceneId: string) {
        const scene = await this.scenesRepository.findByInfraUserId(infraSceneId)

        if (!scene) {
            throw new NotFoundException(`Scene with ID "${infraSceneId}" not found.`)
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
