import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import * as os from 'os'
import { AdminsService } from 'src/services/admins/admins.service'
import { RoomsService } from 'src/services/rooms/rooms.service'
import { EntityManager } from 'typeorm'

@Injectable()
export class HealthService {
    constructor(
        private readonly adminsService: AdminsService,
        private readonly roomsService: RoomsService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager
    ) {}

    async getHealthStatus() {
        const dbStatus = await this.checkTableAndSelectRow()
        const diskUsage = this.checkDiskUsage()

        return {
            database: {
                status: dbStatus
            },
            resources: {
                disk: diskUsage
            }
        }
    }

    async getStatistics() {
        const adminCount = await this.adminsService.countAdmins()
        const roomCount = await this.roomsService.countRooms()

        return {
            admins: adminCount,
            rooms: roomCount
        }
    }

    private async checkTableAndSelectRow(): Promise<boolean> {
        const tableName = 'main.admins'

        const tableExistsResult = await this.entityManager.query(`SELECT to_regclass('${tableName}');`)

        if (!tableExistsResult[0].to_regclass) {
            return false
        }

        const row = await this.entityManager.query(`SELECT * FROM ${tableName} LIMIT 1;`)

        if (!row) {
            return false
        }

        return true
    }

    private checkDiskUsage(): string {
        const totalMemory = os.totalmem()
        const freeMemory = os.freemem()
        const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100

        return `${Math.floor(memoryUsage)}%`
    }
}
