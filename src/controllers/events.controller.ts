import { Body, Controller, Post } from '@nestjs/common'
import { HubEventDto, SpokeEventDto } from 'src/services/events/dto'
import { EventsService } from 'src/services/events/events.service'

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post('spoke')
    async handleSpokeEvent(@Body() spokeEventDto: SpokeEventDto) {
        return await this.eventsService.handleSpokeEvent(spokeEventDto)
    }

    @Post('hub')
    async handleHubEvent(@Body() hubEventDto: HubEventDto) {
        return await this.eventsService.handleHubEvent(hubEventDto)
    }
}
