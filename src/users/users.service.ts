import { Injectable, NotFoundException } from '@nestjs/common'
import {
    CacheService,
    convertTimeToSeconds,
    makeHashedId,
    validatePassword
} from 'src/common'
import { UsersRepository } from './users.repository'
import { ReticulumService } from 'src/reticulum'
import { UserConfigService } from './services'

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly reticulumService: ReticulumService,
        private readonly cacheService: CacheService,
        private readonly configService: UserConfigService
    ) {}

    async create(projectId: string, personalId: string) {
        const { account_id: infraUserId } = await this.reticulumService.login(personalId)

        const hashedId = makeHashedId(projectId, personalId)

        const createDto = {
            personalId: hashedId,
            infraUserId: infraUserId,
            projectId: projectId
        }

        return await this.usersRepository.create(createDto)
    }

    async getUser(projectId: string, personalId: string) {
        const hashedId = makeHashedId(projectId, personalId)

        const user = await this.usersRepository.findByPersonalId(hashedId)

        if (!user) {
            throw new NotFoundException(`User with ID "${personalId}" not found`)
        }

        return user
    }

    async findByInfraUserId(infraUserId: string) {
        const user = await this.usersRepository.findByInfraUserId(infraUserId)

        if (!user) {
            throw new NotFoundException(`User with ID "${infraUserId}" not found`)
        }

        return user
    }

    async userExists(projectId: string, personalId: string): Promise<boolean> {
        const hashedId = makeHashedId(projectId, personalId)

        return this.usersRepository.userExists(hashedId)
    }

    async validateUser(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return validatePassword(plainPassword, hashedPassword)
    }

    async getUserToken(projectId: string, personalId: string) {
        const userExists = await this.userExists(projectId, personalId)

        let user

        if (!userExists) {
            user = await this.create(projectId, personalId)
        } else {
            user = await this.getUser(projectId, personalId)
        }

        const key = `userAccessToken:${user.id}`

        let savedToken = await this.cacheService.get(key)

        if (!savedToken) {
            const { token } = await this.reticulumService.login(personalId)

            const expireTime = convertTimeToSeconds(this.configService.accessTokenExpiration)

            await this.cacheService.set(key, token, expireTime)
            await this.cacheService.set(token, `${user.id}`, expireTime)

            savedToken = token
        }

        return savedToken
    }
}
