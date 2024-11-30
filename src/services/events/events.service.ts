import { Injectable, Logger } from '@nestjs/common'
import { ScenesService } from 'src/services/scenes/scenes.service'
import { ProjectsService } from '../projects/projects.service'
import { RoomsService } from '../rooms/rooms.service'
import { UsersService } from '../users/users.service'
import { SpokeEventDto, SpokeEventName } from './dto'
import {
    CallbackData,
    CreateSceneData,   
    UpdateSceneData,
} from './interfaces/event.interface'

@Injectable()
export class EventsService {
    constructor(
        private readonly usersService: UsersService,
        private readonly projectsService: ProjectsService,
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService
    ) {}

    /*
     * Spoke
     */
    async handleSpokeEvent(spokeEventDto: SpokeEventDto) {
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
            infraSceneId: infraSceneId,
            creator: extraObj.creator
        }

        const scene = await this.scenesService.createScene(createData)

        if (extraObj.callback) {
            const callbackData = {
                sceneId: scene.id,
                callbackUrl: extraObj.callback
            }

            await this.callback(callbackData)
        }
    }

    async updateScene(updateSceneData: UpdateSceneData) {
        const { sceneId: infraSceneId } = updateSceneData

        const updateData = {
            infraSceneId: infraSceneId
        }

        await this.scenesService.updateScene(updateData)
    }

    private async callback(callbackData: CallbackData) {
        const { sceneId, callbackUrl } = callbackData

        const fetchBody = {
            sceneId
        }

        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fetchBody)
        }

        const response = await fetch(decodeURIComponent(callbackUrl), fetchOptions)

        if (300 <= response.status) {
            const errorData = await response.text()

            Logger.error(`Failed to fetch for callbackUrl: "${callbackUrl}"`, errorData)
        }
    }

   
}
