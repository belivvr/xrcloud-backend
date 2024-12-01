import { Injectable, Logger } from '@nestjs/common'
import { ProjectsService } from '../projects/projects.service'
import { RoomsService } from '../rooms/rooms.service'
import { ScenesService } from '../scenes/scenes.service'
import { RoomLogsRepository } from './room-logs.repository'
import { SceneLogsRepository } from './scene-logs.repository'
import { LogCode, LogDto, LogType, RoomLogCodes, SceneLogCodes } from './dto'
import {    
    LogData
} from './interfaces'
import { RoomLogs, SceneLogs } from './entities'

@Injectable()
export class LogsService {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly roomsService: RoomsService,
        private readonly sceneService: ScenesService,
        private readonly roomLogsRepository: RoomLogsRepository,
        private readonly sceneLogsRepository: SceneLogsRepository,
    ) {}


    async logging(logDto: LogDto) {
        Logger.log(`handleRoomLog-LogDto: ${logDto}`)
        const type = this.determineLogType(logDto.code as LogCode);        
        let project = null

        switch (type) {
            case LogType.ROOM : 
                Logger.log('Join room Log1')
                const room = await this.roomsService.findRoomByInfraRoomId(logDto.resourceId)
                Logger.log('Join room Log1,room:',room?.id)
                if (!room) {
                    Logger.error('Join room Log: Failed to find room')
                    return
                }
                
                const roomLogDto = new RoomLogs(room.id,logDto);
                console.log('roomLogDto:',roomLogDto)
                this.roomLogsRepository.create(roomLogDto)
                                
                project = await this.projectsService.getProject(room.projectId)
                
                logDto.resourceId = room.id
                if (project.webhookUrl){                    
                    await this.webhook(project.webhookUrl,logDto);
                    Logger.log(`webhook send Complete`)
                }
                
                Logger.log(`logService Complete`)
                break
                
            case LogType.SCENE : 
                const scene = await this.sceneService.getScene(logDto.resourceId)                
                if (!scene) {
                    Logger.log('Join room Log: Failed to find room')
                    return
                }
                
                const sceneLogDto = new SceneLogs(scene.id,logDto);

                this.sceneLogsRepository.create(sceneLogDto)                
                
                project = await this.projectsService.getProject(scene.projectId)         
                logDto.resourceId = scene.id
                
                if (project.webhookUrl){                    
                    await this.webhook(project.webhookUrl,logDto);
                    Logger.log(`webhook send Complete`)
                }
                Logger.log(`logService Complete`)
                break
            default:
                break
        }
        
       
    }

    
    private determineLogType(code: LogCode): LogType | null {
    if (RoomLogCodes.includes(code)) {
            return LogType.ROOM; // 또는 적절한 Room 관련 LogType
        } else if (SceneLogCodes.includes(code)) {
            return LogType.SCENE; // 또는 적절한 Scene 관련 LogType
        }
        return LogType.UNKNOWN; // 알 수 없는 코드일 경우
    }


    private async webhook(webhookUrl: string, webhookData: LogDto) {        
        
        Logger.log(`Sending webhook to URL: ${webhookUrl}`)
        Logger.log(`Webhook data: ${JSON.stringify(webhookData)}`)

        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Forwarded-For': webhookData.ip || ''
            },
            body: JSON.stringify(webhookData)
        }

        const response = await fetch(decodeURIComponent(webhookUrl || ''), fetchOptions)

        Logger.log(`response data: ${response}`)


        if (300 <= response.status) {
            const errorData = await response.text()

            Logger.error(`Failed to fetch for webhookUrl: "${webhookUrl}"`, errorData)
        }
    }
}
