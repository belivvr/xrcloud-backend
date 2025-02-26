import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import fetch from 'node-fetch'
import { CacheService, addQuotesToNumbers, convertTimeToSeconds } from 'src/common'
import { ExtraArgs, NotificationData, RoomData } from './interfaces'
import { ReticulumConfigService } from './reticulum-config.service'

@Injectable()
export class ReticulumService {
    private readonly host: string
    private readonly apiHost: string
    private readonly adminId: string
    private readonly userTokenExpiration: string

    constructor(
        private readonly configService: ReticulumConfigService,
        private readonly cacheService: CacheService
    ) {
        this.host = this.configService.host
        this.apiHost = this.configService.apiHost
        this.adminId = this.configService.adminId
        this.userTokenExpiration = this.configService.userTokenExpiration
    }

    private async request(url: string, options?: any) {
        const response = await fetch(`${this.apiHost}/${url}`, options)

        if (response.status >= 300) {
            return
        }

        const responseText = await response.text()

        if (!responseText) {
            return true
        }

        try {
            return JSON.parse(addQuotesToNumbers(responseText))
        } catch (e) {
            return response
        }
    }

    async login(userId: string) {
        const body = JSON.stringify({ email_id: userId })

        const response = await this.request('api/v1/belivvr/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })

        if (!response || !response.token || typeof response.token !== 'string') {
            throw new InternalServerErrorException('Reticulum: Failed to login')
        }

        return response
    }

    async getSceneCreationInfo(token: string | undefined, extraArgs: ExtraArgs) {
        if (!token) {
            throw new InternalServerErrorException('Reticulum: Token is required')
        }

        const callbackUrl = `${this.host}/events/spoke`
        const encodedCallbackUrl = encodeURIComponent(callbackUrl)

        const extraParts = [`projectId:${extraArgs.projectId}`]

        if (extraArgs.creator) {
            extraParts.push(`creator:${extraArgs.creator}`)
        }

        if (extraArgs.callback) {
            extraParts.push(`callback:${extraArgs.callback}`)
        }

        const extra = extraParts.join('&')

        const returnValue = {
            url: `${this.apiHost}/spoke/projects/new`,
            options: {
                token,
                eventCallback: encodedCallbackUrl,
                extra
            }
        }

        return returnValue
    }

    async getScene(infraSceneId: string) {
        const { token } = await this.login(this.adminId)

        const url = `api/postgrest/scenes?scene_sid=eq.${infraSceneId}`

        const response = await this.request(url, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })

        if (response.length === 0) {
            throw new InternalServerErrorException(`Reticulum: Scene with ID "${infraSceneId}" not found`)
        }

        return response[0]
    }

    async getSceneModificationInfo(infraProjectId: string, token: string | undefined) {
        if (!token) {
            throw new InternalServerErrorException('Reticulum: Token is required')
        }

        const callbackUrl = `${this.host}/events/spoke`
        const encodedCallbackUrl = encodeURIComponent(callbackUrl)

        const returnValue = {
            url: `${this.apiHost}/spoke/projects/${infraProjectId}`,
            options: {
                token,
                eventCallback: encodedCallbackUrl
            }
        }

        return returnValue
    }

    async createRoom(infraSceneId: string, roomData: RoomData) {
        const { name, size, token } = roomData

        const body = JSON.stringify({
            hub: {
                scene_id: infraSceneId,
                name: name,
                room_size: size
            }
        })

        const response = await this.request('api/v1/hubs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            body
        })

        if (!response) {
            throw new InternalServerErrorException(`Reticulum: Failed to create room`)
        }

        return response
    }

    generateRoomUrl(infraRoomId: string, slug: string) {
        return `${this.apiHost}/${infraRoomId}/${slug}`
    }

    // 쓰는 곳 못 찾음
    async getRoom (infraRoomId: string) {
        const { token } = await this.login(this.adminId)

        const url = `api/postgrest/hubs?hub_sid=eq.${infraRoomId}`

        const response = await this.request(url, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })

        if (response.length === 0) {
            throw new InternalServerErrorException(`Reticulum: Hub with ID "${infraRoomId}" not found`)
        }

        return response[0]
    }

    async updateRoom(infraRoomId: string, roomData: RoomData) {
        const { name, size, token } = roomData

        const body = JSON.stringify({
            hub: {
                name: name,
                room_size: size
            }
        })

        const response = await this.request(`api/v1/hubs/${infraRoomId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            body
        })

        if (!response) {
            throw new InternalServerErrorException(`Reticulum: Failed to update room`)
        }

        return response
    }

    async getThumbnailId(screenshotFileId: string) {
        const { token } = await this.login(this.adminId)

        const url = `api/postgrest/owned_files?id=eq.${screenshotFileId}`

        const response = await this.request(url, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })

        if (response.length === 0) {
            throw new InternalServerErrorException(
                `Reticulum: Thumbnail file with ID "${screenshotFileId}" not found`
            )
        }

        return response[0].owned_file_uuid
    }

    async getThumbnailUrl(screenshotFileId: string) {
        const url = `${this.apiHost}/files/${screenshotFileId}.jpg`

        return url
    }

    async createNoticeForAll(notificationData: NotificationData) {
        const { payload } = notificationData

        const body = JSON.stringify({
            payload
        })

        const response = await this.request('api/v1/belivvr_notices/all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })

        if (!response) {
            throw new InternalServerErrorException(`Reticulum: Failed to create notice for all`)
        }
    }

    async createNoticeForScene(notificationData: NotificationData, sceneId: string) {
        const { payload } = notificationData

        const body = JSON.stringify({
            payload
        })

        const response = await this.request(`api/v1/belivvr_notices/scenes/${sceneId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })

        if (!response) {
            throw new InternalServerErrorException(`Reticulum: Failed to create notice for scene`)
        }
    }

    async createNoticeForRoom(notificationData: NotificationData, roomId: string) {
        const { payload } = notificationData

        const body = JSON.stringify({
            payload
        })

        const response = await this.request(`api/v1/belivvr_notices/hubs/${roomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })

        if (!response) {
            throw new InternalServerErrorException(`Reticulum: Failed to create notice for hub`)
        }
    }

    async getAdminToken(projectId: string): Promise<string> {
        const emailId = `admin@${projectId}`

        Logger.log(`Admin email ID: ${emailId}`);

        const key = `reticulumToken:${emailId}`

        // 캐시 삭제
        await this.cacheService.delete(key)

        let savedToken = await this.cacheService.get(key)
        

        if (!savedToken) {
            const { token } = await this.login(emailId)
            Logger.log(`Get from XRCLOUD Admin Token: ${token}`);

            const expireTime = this.userTokenExpiration

            const convertExpireTime = convertTimeToSeconds(expireTime)

            await this.cacheService.set(key, token, convertExpireTime)

            savedToken = token
        }

        return savedToken as string
    }

    async getUserToken(projectId: string, userId: string): Promise<string> {
        const emailId = `${userId}@${projectId}`
        
        const key = `reticulumToken:${emailId}`

        Logger.log(`User email ID: ${emailId}`);
        // 캐시 삭제
       await this.cacheService.delete(key)

        let savedToken = await this.cacheService.get(key)

        if (!savedToken) {
            const { token } = await this.login(emailId)
            Logger.log(`Get from XRCLOUD User Token: ${token}`);

            const expireTime = this.userTokenExpiration

            const convertExpireTime = convertTimeToSeconds(expireTime)

            await this.cacheService.set(key, token, convertExpireTime)

            savedToken = token
        }

        return savedToken as string
    }

    async getAccountId(projectId: string, userId = 'admin') {
        const emailId = `${userId}@${projectId}`

        const { account_id } = await this.login(emailId)

        return {
            reticulumId: account_id
        }
    }
}
