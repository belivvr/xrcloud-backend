import { Injectable } from '@nestjs/common'
import { ScenesService } from 'src/scenes'
import { EventDto, EventName } from './dto'

@Injectable()
export class CallbacksService {
    constructor(private readonly scenesService: ScenesService) {}

    async event(eventDto: EventDto) {
        const { eventName, projectId: infraProjectId, sceneId: infraSceneId } = eventDto

        switch (eventName) {
            case EventName.SCENE_CREATED: {
                const createData = {
                    projectId: infraProjectId,
                    sceneId: infraSceneId
                }

                await this.scenesService.createScene(createData)

                break
            }
            case EventName.SCENE_UPDATED: {
                const updateData = {
                    sceneId: infraSceneId
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
}
