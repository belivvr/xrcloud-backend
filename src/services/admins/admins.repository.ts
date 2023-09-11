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

    async findByIdWithPassword(adminId: string): Promise<Admin | null> {
        const qb = this.createQueryBuilder()
            .addSelect('entity.password')
            .where('entity.id = :adminId', { adminId })

        return qb.getOne()
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
        return this.typeorm.count()
    }
}
