import { Body, Controller, Post } from '@nestjs/common'
import { CreateEventDto } from 'src/services/events/dto'
import { EventsService } from 'src/services/events/events.service'

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    async createEvent(@Body() createEventDto: CreateEventDto) {
        return createEventDto
    }

    // @Post()
    // async createEvent(@Body() createEventDto: CreateEventDto) {
    //     return await this.eventsService.createEvent(createEventDto)
    // }
}
