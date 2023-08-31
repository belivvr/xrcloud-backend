import { Controller, Get } from '@nestjs/common'
import { HealthService } from './health.service'

@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Get()
    async getHealthStatus() {
        return await this.healthService.getHealthStatus()
    }

    @Get('statistics')
    async getStatistics() {
        return await this.healthService.getStatistics()
    }
}
