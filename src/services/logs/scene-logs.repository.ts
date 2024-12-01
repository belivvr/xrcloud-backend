/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseEntityRepository } from 'src/common'
import { Repository } from 'typeorm'
import { SceneLogs } from './entities/scene-logs.entity'

@Injectable()
export class SceneLogsRepository extends BaseEntityRepository<SceneLogs> {
    constructor(@InjectRepository(SceneLogs) typeorm: Repository<SceneLogs>) {
        super(typeorm)
    }

    async findBySceneId(scendId: string): Promise<SceneLogs[]> {
        const qb = this.createQueryBuilder()
            .where('entity.scendId = :scendId', { scendId })

        return qb.getMany()
    }

    async findBySessionId(sessionId: string): Promise<SceneLogs | null> {
        const qb = this.createQueryBuilder()
        .where('entity.sessionId = :sessionId', { sessionId })
        return qb.getMany()
    }    
    
}
