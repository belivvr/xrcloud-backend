import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository } from 'src/common'
import { Repository } from 'typeorm'
import { User } from './entities'

@Injectable()
export class UsersRepository extends BaseRepository<User> {
    constructor(@InjectRepository(User) typeorm: Repository<User>) {
        super(typeorm)
    }

    async findByProjectIdAndInfraUserId(projectId: string, infraUserId: string): Promise<User | null> {
        return this.typeorm.findOne({
            where: {
                projectId,
                infraUserId 
            }
        })
    }

    async findByReticulumId(reticulumId: string): Promise<User | null> {
        return this.typeorm.findOneBy({ reticulumId })
    }
}
