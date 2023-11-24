import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import * as os from 'os'
import { AdminsService } from 'src/services/admins/admins.service'
import { RoomsService } from 'src/services/rooms/rooms.service'
import { EntityManager } from 'typeorm'
import { ScenesService } from '../scenes/scenes.service'

@Injectable()
export class HealthService {
    constructor(
        private readonly adminsService: AdminsService,
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager
    ) {}

    async getHealthStatus() {
        const dbStatus = await this.checkTableAndSelectRow()
        const diskUsage = this.checkDiskUsage()
        const cpuUsage = await this.checkCpuUsage()

        return {
            database: {
                status: dbStatus
            },
            resources: {
                cpu: cpuUsage,
                disk: diskUsage
            }
        }
    }

    async getStatistics() {
        const adminCount = await this.adminsService.countAdmins()
        const sceneCount = await this.scenesService.countScenes()
        const roomCount = await this.roomsService.countRooms()
        const roomAccessesCount = await this.roomsService.countRoomAccesses()

        return {
            admins: adminCount,
            scenes: sceneCount,
            rooms: roomCount,
            roomAccesses: roomAccessesCount
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

    private async checkCpuUsage(): Promise<string> {
        const getAverageLoad = () => {
            const cpus = os.cpus()

            let totalIdle = 0
            let totalTick = 0

            cpus.forEach((core) => {
                const times: { [key: string]: number } = core.times as { [key: string]: number }

                let total = 0

                for (const type in times) {
                    total += times[type]
                    if (type === 'idle') {
                        totalIdle += times[type]
                    }
                }

                totalTick += total
            })

            return { idle: totalIdle / cpus.length, total: totalTick / cpus.length }
        }

        const start = getAverageLoad()

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const end = getAverageLoad()

        const idleDifference = end.idle - start.idle
        const totalDifference = end.total - start.total

        const percentageCpu = 100 - ~~((100 * idleDifference) / totalDifference)

        return `${percentageCpu}%`
    }
}
