import { Injectable } from '@nestjs/common'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { CnuEventService } from '../cnu-event'
import { SpokeEventDto, SpokeEventName } from './dto'
import { CreateSceneData, UpdateSceneData } from './interfaces'

@Injectable()
export class EventsService {
    constructor(
        private readonly scenesService: ScenesService,
        private readonly cnuEventService: CnuEventService
    ) {}

    async createEvent(spokeEventDto: SpokeEventDto) {
        const eventName = spokeEventDto.eventName

        switch (eventName) {
            case SpokeEventName.SCENE_CREATED: {
                const { projectId, sceneId, extra } = spokeEventDto

                const createSceneData: CreateSceneData = {
                    projectId,
                    sceneId,
                    extra
                }

                await this.createScene(createSceneData)

                break
            }

            case SpokeEventName.SCENE_UPDATED: {
                const { sceneId } = spokeEventDto

                const updateSceneData: UpdateSceneData = {
                    sceneId
                }

                await this.updateScene(updateSceneData)

                break
            }
        }
    }

    async createScene(createSceneData: CreateSceneData) {
        const { projectId: infraProjectId, sceneId: infraSceneId, extra: extraArgs } = createSceneData

        const extraObj: Record<string, string> = {}

        if (extraArgs) {
            const extraParts = extraArgs.split('&')

            for (const part of extraParts) {
                const [key, value] = part.split(':')
                if (key && value) {
                    extraObj[key] = value
                }
            }
        }

        const createData = {
            projectId: extraObj.projectId,
            infraProjectId: infraProjectId,
            infraSceneId: infraSceneId
        }

        const scene = await this.scenesService.createScene(createData)

        if (extraObj.userId) {
            const createCnuEventData = {
                userId: extraObj.userId,
                projectId: extraObj.projectId,
                sceneId: scene.id
            }

            await this.cnuEventService.createCnuEvent(createCnuEventData)
        }
    }

    async updateScene(updateSceneData: UpdateSceneData) {
        const { sceneId: infraSceneId } = updateSceneData

        const updateData = {
            infraSceneId: infraSceneId
        }

        await this.scenesService.updateScene(updateData)
    }
}
