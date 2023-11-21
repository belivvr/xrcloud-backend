import { Controller, Get, Query } from '@nestjs/common'
import { CnuEventQueryDto, CnuEventService } from 'src/services/cnu-event'

@Controller('cnu-event')
export class CnuEventController {
    constructor(private readonly cnuEventService: CnuEventService) {}

    @Get('scenes')
    async getScene(@Query() queryDto: CnuEventQueryDto) {
        return await this.cnuEventService.getScene(queryDto)
    }

    @Get('rooms')
    async getRoom(@Query() queryDto: CnuEventQueryDto) {
        return await this.cnuEventService.getRoom(queryDto)
    }
}
