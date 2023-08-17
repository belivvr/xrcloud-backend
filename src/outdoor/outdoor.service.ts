import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CacheService } from 'src/common'
import { ScenesService } from 'src/scenes'
import { CreateEventDto, EventName } from './dto'

@Injectable()
export class OutdoorService {
    constructor(private readonly scenesService: ScenesService, private readonly cacheService: CacheService) {}

    async createEvent(createEventDto: CreateEventDto) {
        const {
            eventName,
            extra: extraArgs,
            projectId: infraProjectId,
            sceneId: infraSceneId
        } = createEventDto

        const extraObj: Record<string, string> = {}

        if (extraArgs) {
            const extraParts = extraArgs.split(',')

            for (const part of extraParts) {
                const [key, value] = part.split(':')
                if (key && value) {
                    extraObj[key] = value
                }
            }
        }

        switch (eventName) {
            case EventName.SCENE_CREATED: {
                const createData = {
                    projectId: extraObj.projectId,
                    infraProjectId: infraProjectId,
                    infraSceneId: infraSceneId
                }

                await this.scenesService.createScene(createData)

                break
            }
            case EventName.SCENE_UPDATED: {
                const updateData = {
                    infraSceneId: infraSceneId
                }

                await this.scenesService.updateScene(updateData)

                break
            }
            default: {
                // TODO
                break
            }
        }
    }

    async getOption(optionId: string) {
        const option = await this.cacheService.get(optionId)

        if (!option) {
            throw new UnauthorizedException('Invalid optionId.')
        }

        return JSON.parse(option)
    }
}
