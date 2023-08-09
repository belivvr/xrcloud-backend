import { Body, Controller, Post } from '@nestjs/common'
import { CallbacksService } from './callbacks.service'
import { CreateEventDto } from './dto'

@Controller('callbacks')
export class CallbacksController {
    constructor(private readonly callbacksService: CallbacksService) {}

    @Post('event')
    async createEvent(@Body() createEventDto: CreateEventDto) {
        return await this.callbacksService.createEvent(createEventDto)
    }
}
