/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseEntityRepository } from 'src/common'
import { Repository } from 'typeorm'
import { RoomActivity } from './entities'

@Injectable()
export class RoomActivityRepository extends BaseEntityRepository<RoomActivity> {
    constructor(@InjectRepository(RoomActivity) typeorm: Repository<RoomActivity>) {
        super(typeorm)
    }
}
