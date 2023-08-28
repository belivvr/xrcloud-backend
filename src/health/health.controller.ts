import { Controller, Post } from '@nestjs/common'
import { HealthService } from './health.service'

@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Post('statistics')
    async createStatistics() {
        return await this.healthService.getStatistics()
    }
}
