import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common'
import fetch from 'node-fetch'
import { CacheService, addQuotesToNumbers, convertTimeToSeconds } from 'src/common'
import { ExtraArgs, UpdateRoomArgs } from './interfaces'
import { ReticulumConfigService } from './services'

@Injectable()
export class ReticulumService {
    private host
    private apiHost
    private adminId

    constructor(
        private readonly configService: ReticulumConfigService,
        private readonly cacheService: CacheService
    ) {
        this.host = this.configService.host
        this.apiHost = this.configService.apiHost
        this.adminId = this.configService.adminId
    }

    private async request(url: string, options?: any) {
        const response = await fetch(`${this.apiHost}/${url}`, options)

        if (300 <= response.status) {
            throw new HttpException(
                `HTTP request failed with status code ${response.status}`,
                response.status
            )
        }

        const responseToText = await response.text()

        return JSON.parse(addQuotesToNumbers(responseToText))
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

        if (!response || !response.token) {
            throw new InternalServerErrorException('Reticulum: Failed to login')
        }

        return response
    }

    async getSceneCreationInfo(token: string | undefined, extraArgs: ExtraArgs) {
        if (!token) {
            throw new InternalServerErrorException('Reticulum: Token is required')
        }

        const callbackUrl = `${this.host}/outdoor/event`
        const encodedCallbackUrl = encodeURIComponent(callbackUrl)

        const extra = `projectId:${extraArgs.projectId}`

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

        const callbackUrl = `${this.host}/outdoor/event`
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

    async createRoom(infraSceneId: string, name: string, token: string | undefined) {
        const body = JSON.stringify({
            hub: {
                scene_id: infraSceneId,
                name: name
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

    getRoomInfo(infraRoomId: string, slug: string, token?: string) {
        const returnValue = {
            url: `${this.apiHost}/${infraRoomId}/${slug}`,
            options: token ? { token } : undefined
        }

        return returnValue
    }

    async updateRoom(infraRoomId: string, updateRoomArgs: UpdateRoomArgs) {
        const { name, size, token } = updateRoomArgs

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

    async getToken(projectId: string, expireTime: string, userId?: string) {
        if (!userId) {
            userId = `admin@${projectId}`
        }

        const key = `${projectId}:${userId}`

        let savedToken = await this.cacheService.get(key)

        if (!savedToken) {
            const { token } = await this.login(userId)

            const convertExpireTime = convertTimeToSeconds(expireTime)

            await this.cacheService.set(key, token, convertExpireTime)

            savedToken = token
        }

        return savedToken
    }
}
