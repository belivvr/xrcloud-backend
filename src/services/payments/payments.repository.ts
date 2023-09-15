import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseRepository } from 'src/common'
import { Repository } from 'typeorm'
import { Payment } from './entities'

@Injectable()
export class PaymentRepository extends BaseRepository<Payment> {
    constructor(@InjectRepository(Payment) typeorm: Repository<Payment>) {
        super(typeorm)
    }
}
