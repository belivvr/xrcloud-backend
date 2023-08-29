import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Assert, CacheService, convertTimeToSeconds, generateUUID, updateIntersection } from 'src/common'
import { ProjectsService } from 'src/projects/projects.service'
import { ReticulumService } from 'src/reticulum/reticulum.service'
import { CreateSceneDto, SceneDto, SceneQueryDto, UpdateSceneDto } from './dto'
import { Scene } from './entities'
import { ScenesRepository } from './scenes.repository'
import { SceneConfigService } from './services/scene-config.service'

@Injectable()
export class ScenesService {
    constructor(
        private readonly scenesRepository: ScenesRepository,
        private readonly reticulumService: ReticulumService,
        private readonly cacheService: CacheService,
        private readonly configService: SceneConfigService,
        private readonly projectsService: ProjectsService
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

    async findScenes(sceneQueryDto: SceneQueryDto) {
        const scenes = await this.scenesRepository.find(sceneQueryDto)

        return scenes
    }

    async getScene(sceneId: string): Promise<Scene> {
        const scene = await this.scenesRepository.findById(sceneId)

        Assert.defined(scene, `Scene with ID "${sceneId}" not found.`)

        return scene as Scene
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

        return savedScene
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

    async validateSceneExists(sceneId: string) {
        const sceneExists = await this.sceneExists(sceneId)

        if (!sceneExists) {
            throw new NotFoundException(`Scene with ID "${sceneId}" not found.`)
        }
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

    async getSceneModificationUrl(projectId: string, sceneId: string) {
        const scene = await this.getScene(sceneId)

        const token = await this.reticulumService.getAdminToken(projectId)

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

    async getSceneResources(sceneId: string) {
        const scene = await this.getScene(sceneId)

        const project = await this.projectsService.getProject(scene.projectId)

        const returnValue = {
            projectId: project.id,
            faviconId: project.faviconId,
            logoId: project.logoId
        }

        return returnValue
    }
}
