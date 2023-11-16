import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Assert, CacheService, generateUUID, updateIntersection } from 'src/common'
import { ReticulumService } from 'src/infra/reticulum/reticulum.service'
import { ProjectsService } from '../projects/projects.service'
import { RoomsService } from '../rooms/rooms.service'
import { ScenesService } from '../scenes/scenes.service'
import { CnuEventRepository } from './cnu-event.repository'
import { CnuEventQueryDto, CreateCnuEventDto, UpdateCnuEventDto } from './dto'
import { CnuEvent } from './entities'

@Injectable()
export class CnuEventService {
    constructor(
        private readonly cnuEventRepository: CnuEventRepository,
        private readonly projectsService: ProjectsService,
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService,
        private readonly reticulumService: ReticulumService,
        private readonly cacheService: CacheService
    ) {}

    async createCnuEvent(createCnuEventDto: CreateCnuEventDto) {
        const { userId } = createCnuEventDto

        const cnuEvent = await this.findCnuEventByUserId(userId)

        if (cnuEvent) {
            throw new ConflictException(`Cnu-event with userId ${userId} already exists`)
        }

        await this.cnuEventRepository.create(createCnuEventDto)
    }

    async getCnuEvent(eventId: string): Promise<CnuEvent> {
        const cnuEvent = await this.cnuEventRepository.findById(eventId)

        Assert.defined(cnuEvent, `Cnu-event with ID "${eventId}" not found.`)

        return cnuEvent as CnuEvent
    }

    // TODO: fix findProjectByLabel
    async getScene(queryDto: CnuEventQueryDto) {
        const { projectLabel: label, userId } = queryDto

        const project = await this.projectsService.findProjectByLabel(label)

        if (!project) {
            throw new NotFoundException(`Project with label "${label}" not found.`)
        }

        const cnuEvent = await this.findCnuEventByUserId(userId)

        const url = cnuEvent
            ? await this.getSceneModificationUrl(project.id, cnuEvent.sceneId, cnuEvent.userId)
            : await this.getSceneCreationUrl(project.id, userId)

        return url
    }

    async getRoom(queryDto: CnuEventQueryDto) {
        const { userId } = queryDto

        const cnuEvent = await this.findCnuEventByUserId(userId)

        if (!cnuEvent) {
            throw new NotFoundException(`Cnu-event with userId "${userId}" not found.`)
        }

        if (!cnuEvent.roomId) {
            const room = await this.createRoom(cnuEvent.id)

            await this.updateCnuEvent(cnuEvent.id, { roomId: room.id })

            return room.roomUrl.public.host
        }

        const { public: publicUrl } = await this.roomsService.getRoomUrl(cnuEvent.roomId, userId)

        return publicUrl.host
    }

    async updateCnuEvent(cnuEventId: string, updateCnuEventDto: UpdateCnuEventDto) {
        const cnuEvent = await this.getCnuEvent(cnuEventId)

        const updatedCnuEvent = updateIntersection(cnuEvent, updateCnuEventDto)

        const savedCnuEvent = await this.cnuEventRepository.update(updatedCnuEvent)

        Assert.deepEquals(savedCnuEvent, updatedCnuEvent, 'The result is different from the update request')

        return savedCnuEvent
    }

    async findCnuEventByUserId(userId: string) {
        const cnuEvent = await this.cnuEventRepository.findByUserId(userId)

        return cnuEvent
    }

    /*
     * private method
     */
    private async getSceneCreationUrl(projectId: string, userId: string) {
        const token = await this.reticulumService.getUserToken(projectId, userId)

        const extraArgs = {
            projectId: projectId,
            userId: userId
        }

        const { url, options } = await this.reticulumService.getSceneCreationInfo(token, extraArgs)

        const optionId = generateUUID()

        const key = `option:${optionId}`

        await this.cacheService.set(key, JSON.stringify(options))

        const sceneCreationUrl = `${url}?optId=${optionId}`

        return sceneCreationUrl
    }

    private async getSceneModificationUrl(projectId: string, sceneId: string, userId: string) {
        const scene = await this.scenesService.getScene(sceneId)

        const token = await this.reticulumService.getUserToken(projectId, userId)

        const { url, options } = await this.reticulumService.getSceneModificationInfo(
            scene.infraProjectId,
            token
        )

        const optionId = generateUUID()

        const key = `option:${optionId}`

        await this.cacheService.set(key, JSON.stringify(options))

        const sceneModificationUrl = `${url}?optId=${optionId}`

        return sceneModificationUrl
    }

    private async createRoom(cnuEventId: string) {
        const cnuEvent = await this.getCnuEvent(cnuEventId)

        const createRoomData = {
            projectId: cnuEvent.projectId,
            sceneId: cnuEvent.sceneId,
            name: 'cnu',
            size: 10,
            returnUrl: 'https://cnumeta.jnu.ac.kr/metaversity-contest'
        }

        return await this.roomsService.createRoom(createRoomData)
    }
}
