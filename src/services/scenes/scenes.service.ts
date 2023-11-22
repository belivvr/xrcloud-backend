import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Assert, CacheService, convertTimeToSeconds, generateUUID, updateIntersection } from 'src/common'
import { ReticulumService } from 'src/infra/reticulum/reticulum.service'
import { ProjectsService } from 'src/services/projects/projects.service'
import { AdminsService } from '../admins/admins.service'
import { CreateSceneDto, GetSceneCreationUrlDto, SceneDto, ScenesQueryDto, UpdateSceneDto } from './dto'
import { Scene } from './entities'
import { SceneConfigService } from './scene-config.service'
import { ScenesRepository } from './scenes.repository'

@Injectable()
export class ScenesService {
    constructor(
        private readonly scenesRepository: ScenesRepository,
        private readonly reticulumService: ReticulumService,
        private readonly cacheService: CacheService,
        private readonly configService: SceneConfigService,
        private readonly projectsService: ProjectsService,
        private readonly adminsService: AdminsService
    ) {}

    async createScene(createSceneDto: CreateSceneDto) {
        const { projectId, infraSceneId } = createSceneDto

        // TODO
        await this.projectsService.validateProjectExists(projectId)

        if (await this.infraSceneExists(infraSceneId)) {
            throw new ConflictException(`Scene with ID "${infraSceneId}" already exists.`)
        }

        const infraScene = await this.reticulumService.getScene(infraSceneId)

        const thumbnailId = await this.reticulumService.getThumbnailId(infraScene.screenshot_owned_file_id)

        const createScene = {
            name: infraScene.name,
            thumbnailId: thumbnailId,
            ...createSceneDto
        }

        const scene = await this.scenesRepository.create(createScene)

        return this.getSceneDto(scene.id)
    }

    async findScenes(queryDto: ScenesQueryDto) {
        const scenes = await this.scenesRepository.find(queryDto)

        if (scenes.items.length === 0) {
            return { ...scenes, items: [] }
        }

        const dtos = await Promise.all(scenes.items.map((scene) => this.getSceneDto(scene.id)))

        return { ...scenes, items: dtos }
    }

    async getSceneCreationUrl(queryDto: GetSceneCreationUrlDto) {
        const { projectId, tag, callback, creator } = queryDto

        const token = creator
            ? await this.reticulumService.getUserToken(projectId, creator)
            : await this.reticulumService.getAdminToken(projectId)

        const extraArgs = {
            projectId: projectId,
            tag: tag ? tag : 'tag',
            creator,
            callback
        }

        const { url, options } = await this.reticulumService.getSceneCreationInfo(token, extraArgs)

        const optionId = generateUUID()

        const key = `option:${optionId}`

        const expireTime = convertTimeToSeconds(this.configService.sceneOptionExpiration)

        await this.cacheService.set(key, JSON.stringify(options), expireTime)

        const sceneCreationUrl = `${url}?optId=${optionId}`

        return { sceneCreationUrl }
    }

    async getSceneDto(sceneId: string) {
        const scene = await this.getScene(sceneId)

        const thumbnailUrl = await this.reticulumService.getThumbnailUrl(scene.thumbnailId)
        const sceneModificationUrl = await this.getSceneModificationUrl(scene.id)

        const dto = new SceneDto(scene)
        dto.thumbnailUrl = thumbnailUrl
        dto.sceneModificationUrl = sceneModificationUrl

        return dto
    }

    async getScene(sceneId: string): Promise<Scene> {
        const scene = await this.scenesRepository.findById(sceneId)

        Assert.defined(scene, `Scene with ID "${sceneId}" not found.`)

        return scene as Scene
    }

    async getSceneModificationUrl(sceneId: string) {
        const scene = await this.getScene(sceneId)

        const token = scene.creator
            ? await this.reticulumService.getUserToken(scene.projectId, scene.creator)
            : await this.reticulumService.getAdminToken(scene.projectId)

        const { url, options } = await this.reticulumService.getSceneModificationInfo(
            scene.infraProjectId,
            token
        )

        const optionId = generateUUID()

        const key = `option:${optionId}`

        const expireTime = convertTimeToSeconds(this.configService.sceneOptionExpiration)

        await this.cacheService.set(key, JSON.stringify(options), expireTime)

        const sceneModificationUrl = `${url}?optId=${optionId}`

        return sceneModificationUrl
    }

    async getSceneOption(optionId: string) {
        const key = `option:${optionId}`

        const option = await this.cacheService.get(key)

        if (!option) {
            throw new BadRequestException('Invalid optionId.')
        }

        return JSON.parse(option)
    }

    async updateScene(updateSceneDto: UpdateSceneDto) {
        const { infraSceneId } = updateSceneDto

        const scene = await this.findSceneByInfraSceneId(infraSceneId)

        const infraScene = await this.reticulumService.getScene(infraSceneId)

        const thumbnailId = await this.reticulumService.getThumbnailId(infraScene.screenshot_owned_file_id)

        const updateScene = {
            name: infraScene.name,
            thumbnailId: thumbnailId
        }

        const updatedScene = updateIntersection(scene, updateScene)

        const savedScene = await this.scenesRepository.update(updatedScene)

        Assert.deepEquals(savedScene, updatedScene, 'The result is different from the update request')

        return this.getSceneDto(savedScene.id)
    }

    async togglePublicRoom(sceneId: string) {
        const scene = await this.getScene(sceneId)

        const updateScene = {
            isPublicRoomOnCreate: !scene.isPublicRoomOnCreate
        }

        const updatedScene = updateIntersection(scene, updateScene)

        const savedScene = await this.scenesRepository.update(updatedScene)

        Assert.deepEquals(savedScene, updatedScene, 'The result is different from the update request')

        return this.getSceneDto(savedScene.id)
    }

    async removeScene(sceneId: string) {
        const scene = await this.getScene(sceneId)

        await this.scenesRepository.remove(scene)
    }

    async sceneExists(sceneId: string): Promise<boolean> {
        return this.scenesRepository.exist(sceneId)
    }

    async infraSceneExists(infraSceneId: string): Promise<boolean> {
        return this.scenesRepository.sceneExists(infraSceneId)
    }

    async findSceneByInfraSceneId(infraSceneId: string) {
        const scene = await this.scenesRepository.findByInfraSceneId(infraSceneId)

        if (!scene) {
            throw new NotFoundException(`Scene with ID "${infraSceneId}" not found.`)
        }

        return scene
    }

    async findScenesByProjectId(projectId: string) {
        const scenes = await this.scenesRepository.findByProjectId(projectId)

        return scenes
    }

    async getSceneResources(sceneId: string) {
        const scene = await this.getScene(sceneId)

        const project = await this.projectsService.getProject(scene.projectId)

        const resources = {
            projectId: project.id,
            faviconId: project.faviconId,
            logoId: project.logoId
        }

        return resources
    }
}
