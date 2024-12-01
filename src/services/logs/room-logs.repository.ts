/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseEntityRepository } from 'src/common'
import { Repository } from 'typeorm'
import { RoomLogs } from './entities/room-logs.entity'
import { LogCode} from './dto'
import { SelectQueryBuilder } from 'typeorm'
import { PaginationOptions } from 'src/common/pagination'

@Injectable()
export class RoomLogsRepository extends BaseEntityRepository<RoomLogs> {
    constructor(@InjectRepository(RoomLogs) typeorm: Repository<RoomLogs>) {
        super(typeorm)
    }

    createQueryBuilder(opts?: PaginationOptions): SelectQueryBuilder<RoomLogs> {
        const alias = opts?.alias || 'room_logs';
        return this.typeorm.createQueryBuilder(alias);
    }

    async findByRoomId(roomId: string): Promise<RoomLogs[]> {
        const qb = this.createQueryBuilder()
            .where('room_logs.roomId = :roomId', { roomId })

        return qb.getMany()
    }
    
    async findByInfraUserId(roomId: string, infraUserId: string): Promise<RoomLogs[]> {
        const qb = this.createQueryBuilder()
            .innerJoinAndSelect('room_logs.users', 'users', 'room_logs.reticulumId = users.reticulumId')
            .where('users.infraUserId = :infraUserId', { infraUserId })
            .andWhere('room_logs.roomId = :roomId', { roomId });

        return qb.getMany();
    }


    async findBySessionId(sessionId: string): Promise<RoomLogs | null> {
        const qb = this.createQueryBuilder()
            .where('room_logs.sessionId = :sessionId', { sessionId })

        return qb.getOne()
    }    

    async findByCode(code: string): Promise<RoomLogs[]> {
        const qb = this.createQueryBuilder()
            .where('room_logs.code = :code', { code })

        return qb.getMany()
    }

    // 특정 세션의 최근 룸 입장 세션 ID로그 찾기 - 서비스에서 써야 할것 같은데 쓸일 있을까?
    async findJoinLog(sessionId: string, roomId: string): Promise<RoomLogs | null> {
        const qb = this.createQueryBuilder()
            .where('room_logs.sessionId = :sessionId', { sessionId })
            .andWhere('room_logs.code = :logCode', { logCode: LogCode.ROOM_JOIN })
            .orderBy('room_logs.logTime', 'DESC')

        return qb.getOne()
    }

    async count(): Promise<number> {
        return this.typeorm.count()
    }

}
