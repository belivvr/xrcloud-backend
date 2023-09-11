import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseEntityRepository } from 'src/common'
import { Repository } from 'typeorm'
import { OrderAccount } from './entities'

@Injectable()
export class OrderAccountRepository extends BaseEntityRepository<OrderAccount> {
    constructor(@InjectRepository(OrderAccount) typeorm: Repository<OrderAccount>) {
        super(typeorm)
    }

    async findByAdminId(adminId: string): Promise<OrderAccount | null> {
        return this.typeorm.findOneBy({ adminId })
    }

    async findByAccountId(accountId: number): Promise<OrderAccount | null> {
        return this.typeorm.findOneBy({ accountId })
    }
}
