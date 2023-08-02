import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common'
import fetch from 'node-fetch'
import { addQuotesToNumbers } from 'src/common'
import { UpdateRoomArgs } from './interfaces'
import { ReticulumConfigService } from './services'

@Injectable()
export class ReticulumService {
    private host
    private apiHost
    private adminId

    constructor(private readonly config: ReticulumConfigService) {
        this.host = this.config.host
        this.apiHost = this.config.apiHost
        this.adminId = this.config.adminId
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

    async login(personalId: string) {
        const body = JSON.stringify({ email_id: personalId })

        const response = await this.request('api/v1/belivvr/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })

        if (!response || !response.token) {
            throw new InternalServerErrorException('Reticulumn: Failed to login')
        }

        return response
    }

    async getSceneCreationUrl(token: string | undefined) {
        if (!token) {
            throw new InternalServerErrorException('Reticulumn: Token is required')
        }

        const callbackUrl = `${this.host}/callbacks/event`
        const encodedCallbackUrl = encodeURIComponent(callbackUrl)

        return `${this.apiHost}/spoke/projects/new?token=${token}&event-callback=${encodedCallbackUrl}`
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
            throw new InternalServerErrorException(`Reticulumn: Scene with ID "${infraSceneId}" not found`)
        }

        return response[0]
    }

    async getSceneModificationUrl(infraProjectId: string, token: string | undefined) {
        if (!token) {
            throw new InternalServerErrorException('Reticulumn: Token is required')
        }

        const callbackUrl = `${this.host}/callbacks/event`
        const encodedCallbackUrl = encodeURIComponent(callbackUrl)

        const url = `${this.apiHost}/spoke/projects/${infraProjectId}?token=${token}&event-callback=${encodedCallbackUrl}`

        try {
            const response = await fetch(url, { method: 'GET' })

            if (!response.ok) {
                return false
            }
        } catch (error) {
            return false
        }

        return url
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
            throw new InternalServerErrorException(`Reticulumn: Failed to create room`)
        }

        return response
    }

    getRoomUrl(infraRoomId: string) {
        const url = `${this.apiHost}/${infraRoomId}`

        return url
    }

    async updateRoom(infraRoomId: string, updateRoomArgs: UpdateRoomArgs) {
        const { name, size, token } = updateRoomArgs

        const body = JSON.stringify({
            hub: {
                name: name,
                size: size
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
            throw new InternalServerErrorException(`Reticulumn: Failed to create room`)
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
                `Reticulumn: Thumbnail file with ID "${screenshotFileId}" not found`
            )
        }

        return response[0].owned_file_uuid
    }

    async getThumbnailUrl(screenshotFileId: string) {
        const url = `${this.apiHost}/files/${screenshotFileId}.jpg`

        return url
    }
}
