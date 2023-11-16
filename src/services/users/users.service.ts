import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async createUser(createUserDto: CreateUserDto) {
        await this.usersRepository.create(createUserDto)
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
