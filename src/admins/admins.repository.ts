import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository } from 'src/common'
import { FindOptionsWhere, Repository } from 'typeorm'
import { Admin } from './entities'

@Injectable()
export class AdminsRepository extends BaseRepository<Admin> {
    constructor(@InjectRepository(Admin) typeorm: Repository<Admin>) {
        super(typeorm)
    }

    async findByEmail(email: string): Promise<Admin | null> {
        return this.typeorm.findOneBy({ email: email })
    }

    async findByApiKey(apiKey: string): Promise<Admin | null> {
        return this.typeorm.findOneBy({ apiKey: apiKey })
    }

    async emailExists(email: string): Promise<boolean> {
        return this.typeorm.exist({
            where: { email } as FindOptionsWhere<Admin>
        })
    }

    async count(): Promise<number> {
        const qb = this.createQueryBuilder()

        const count = await qb.getCount()

        return count
    }
}
