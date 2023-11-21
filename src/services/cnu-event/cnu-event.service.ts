import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Assert, CacheService, generateUUID, updateIntersection } from 'src/common'
import { ReticulumService } from 'src/infra/reticulum/reticulum.service'
import { AdminsService } from '../admins/admins.service'
import { ProjectsService } from '../projects/projects.service'
import { RoomsService } from '../rooms/rooms.service'
import { ScenesService } from '../scenes/scenes.service'
import { CnuEventConfigService } from './cnu-event-config.service'
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
        private readonly cacheService: CacheService,
        private readonly configService: CnuEventConfigService,
        private readonly adminsService: AdminsService
    ) {}

    async createCnuEvent(createCnuEventDto: CreateCnuEventDto) {
        const { creator } = createCnuEventDto

        const cnuEvent = await this.findCnuEventByCreator(creator)

        if (cnuEvent) {
            throw new ConflictException(`Cnu-event with creator ${creator} already exists`)
        }

        await this.cnuEventRepository.create(createCnuEventDto)
    }

    async getCnuEvent(eventId: string): Promise<CnuEvent> {
        const cnuEvent = await this.cnuEventRepository.findById(eventId)

        Assert.defined(cnuEvent, `Cnu-event with ID "${eventId}" not found.`)

        return cnuEvent as CnuEvent
    }

    async getScene(queryDto: CnuEventQueryDto) {
        const { projectLabel: label, creator } = queryDto

        const admin = await this.adminsService.findAdminByEmail(this.configService.cnuAdminEmail)

        if (!admin) {
            throw new NotFoundException(`Admin with email "${this.configService.cnuAdminEmail}" not found.`)
        }

        const project = await this.projectsService.findProjectByAdminIdAndLabel(admin.id, label)

        if (!project) {
            throw new NotFoundException(`Project with label "${label}" not found.`)
        }

        const cnuEvent = await this.findCnuEventByCreator(creator)

        const url = cnuEvent
            ? await this.getSceneUpdateUrl(project.id, cnuEvent.sceneId, cnuEvent.creator)
            : await this.getSceneCreationUrl(project.id, creator)

        return url
    }

    async getRoom(queryDto: CnuEventQueryDto) {
        const { creator } = queryDto

        const cnuEvent = await this.findCnuEventByCreator(creator)

        if (!cnuEvent) {
            throw new NotFoundException(`Cnu-event with creator "${creator}" not found.`)
        }

        if (!cnuEvent.roomId) {
            const room = await this.createRoom(cnuEvent.id)

            await this.updateCnuEvent(cnuEvent.id, { roomId: room.id })

            return room.roomUrl.public.host
        }

        const { public: publicUrl } = await this.roomsService.getRoomUrl(cnuEvent.roomId, creator)

        return publicUrl.host
    }

    async updateCnuEvent(cnuEventId: string, updateCnuEventDto: UpdateCnuEventDto) {
        const cnuEvent = await this.getCnuEvent(cnuEventId)

        const updatedCnuEvent = updateIntersection(cnuEvent, updateCnuEventDto)

        const savedCnuEvent = await this.cnuEventRepository.update(updatedCnuEvent)

        Assert.deepEquals(savedCnuEvent, updatedCnuEvent, 'The result is different from the update request')

        return savedCnuEvent
    }

    async findCnuEventByCreator(creator: string) {
        const cnuEvent = await this.cnuEventRepository.findByCreator(creator)

        return cnuEvent
    }

    /*
     * private method
     */
    private async getSceneCreationUrl(projectId: string, creator: string) {
        const token = await this.reticulumService.getUserToken(projectId, creator)

        const extraArgs = {
            projectId: projectId,
            creator: creator,
            extraData: 'cnu'
        }

        const { url, options } = await this.reticulumService.getSceneCreationInfo(token, extraArgs)

        const optionId = generateUUID()

        const key = `option:${optionId}`

        await this.cacheService.set(key, JSON.stringify(options))

        const sceneCreationUrl = `${url}?optId=${optionId}`

        return sceneCreationUrl
    }

    private async getSceneUpdateUrl(projectId: string, sceneId: string, creator: string) {
        const scene = await this.scenesService.getScene(sceneId)

        const token = await this.reticulumService.getUserToken(projectId, creator)

        const { url, options } = await this.reticulumService.getSceneUpdateInfo(scene.infraProjectId, token)

        const optionId = generateUUID()

        const key = `option:${optionId}`

        await this.cacheService.set(key, JSON.stringify(options))

        const sceneUpdateUrl = `${url}?optId=${optionId}`

        return sceneUpdateUrl
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
