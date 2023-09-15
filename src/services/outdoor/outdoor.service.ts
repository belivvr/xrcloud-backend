import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CacheService } from 'src/common'
import { ManageAssetService } from '../manage-asset/manage-asset.service'
import { CreateEventDto, SpokeEventName } from './dto'

@Injectable()
export class OutdoorService {
    constructor(
        private readonly manageAssetService: ManageAssetService,
        private readonly cacheService: CacheService
    ) {}

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
            case SpokeEventName.SCENE_CREATED: {
                const createData = {
                    projectId: extraObj.projectId,
                    infraProjectId: infraProjectId,
                    infraSceneId: infraSceneId
                }

                await this.manageAssetService.createScene(createData)

                break
            }
            case SpokeEventName.SCENE_UPDATED: {
                const updateData = {
                    infraSceneId: infraSceneId
                }

                await this.manageAssetService.updateScene(updateData)

                break
            }
            default: {
                break
            }
        }
    }

    async getOption(optionId: string) {
        const key = `option:${optionId}`

        const option = await this.cacheService.get(key)

        if (!option) {
            throw new UnauthorizedException('Invalid optionId.')
        }

        return JSON.parse(option)
    }
}
