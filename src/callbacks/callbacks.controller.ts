import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common'
import { CacheService } from 'src/common'
import { CallbacksService } from './callbacks.service'
import { EventDto } from './dto'

@Controller('callbacks')
export class CallbacksController {
    constructor(
        private readonly callbacksService: CallbacksService,
        private readonly cacheService: CacheService
    ) {}

    @Post('event')
    async event(@Body() eventDto: EventDto) {
        if (!(await this.cacheService.get(eventDto.token))) {
            throw new UnauthorizedException('Invalid token.')
        }

        return await this.callbacksService.event(eventDto)
    }
}
