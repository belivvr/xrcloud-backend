import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository } from 'src/common'
import { FindOptionsWhere, Repository } from 'typeorm'
import { User } from './entities'

@Injectable()
export class UsersRepository extends BaseRepository<User> {
    constructor(@InjectRepository(User) typeorm: Repository<User>) {
        super(typeorm)
    }

    async findByPersonalId(personalId: string): Promise<User | null> {
        return this.typeorm.findOneBy({ personalId })
    }

    async findByInfraUserId(infraUserId: string): Promise<User | null> {
        return this.typeorm.findOneBy({ infraUserId })
    }

    async userExists(personalId: string): Promise<boolean> {
        return this.typeorm.exist({
            where: { personalId } as FindOptionsWhere<User>
        })
    }
}
