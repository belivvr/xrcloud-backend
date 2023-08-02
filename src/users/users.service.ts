import { Injectable, NotFoundException } from '@nestjs/common'
import { CacheService, convertTimeToSeconds, makeHashedId, validatePassword } from 'src/common'
import { ReticulumService } from 'src/reticulum'
import { CreateUserDto } from './dto'
import { UserConfigService } from './services'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly reticulumService: ReticulumService,
        private readonly cacheService: CacheService,
        private readonly configService: UserConfigService
    ) {}

    async createUser(createUserDto: CreateUserDto) {
        const { personalId, projectId } = createUserDto

        const { account_id: infraUserId } = await this.reticulumService.login(personalId)

        const hashedId = makeHashedId(personalId, projectId)

        const createUser = {
            personalId: hashedId,
            infraUserId: infraUserId,
            projectId: projectId
        }

        return await this.usersRepository.create(createUser)
    }

    async getUser(personalId: string, projectId: string) {
        const hashedId = makeHashedId(personalId, projectId)

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

    async userExists(personalId: string, projectId: string): Promise<boolean> {
        const hashedId = makeHashedId(personalId, projectId)

        return this.usersRepository.userExists(hashedId)
    }

    async validateUser(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return validatePassword(plainPassword, hashedPassword)
    }

    async getUserToken(personalId: string, projectId: string) {
        const userExists = await this.userExists(personalId, projectId)

        let user

        if (!userExists) {
            user = await this.createUser({ personalId: personalId, projectId: projectId })
        } else {
            user = await this.getUser(personalId, projectId)
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
