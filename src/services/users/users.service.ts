import { Injectable, Logger } from '@nestjs/common'
import { CreateUserDto } from './dto'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(private readonly usersRepository: UsersRepository) {}

    async createUser(createUserDto: CreateUserDto) {
        this.logger.log(`Creating user - Project ID: ${createUserDto.projectId}, Reticulum ID: ${createUserDto.reticulumId}`)
        return await this.usersRepository.create({
            ...createUserDto,
            infraUserId: createUserDto.infraUserId || undefined
        })
    }

    async findUserByProjectIdAndInfraUserId(projectId: string, infraUserId: string) {
        const user = await this.usersRepository.findByProjectIdAndInfraUserId(projectId, infraUserId)
        return user
    }

    async findUserByReticulumId(reticulumId: string) {
        const user = await this.usersRepository.findByReticulumId(reticulumId)
        return user
    }
}
