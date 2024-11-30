import { BadRequestException, Body, Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common'
import { addQuotesToNumbers } from 'src/common'
import { SpokeEventDto } from 'src/services/events/dto'
import { EventsService } from 'src/services/events/events.service'

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post('spoke')
    async handleSpokeEvent(@Body() spokeEventDto: SpokeEventDto) {
        return await this.eventsService.handleSpokeEvent(spokeEventDto)
    }   
}
