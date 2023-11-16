import { BadRequestException, Body, Controller, Post, RawBodyRequest, Req } from '@nestjs/common'
import { addQuotesToNumbers } from 'src/common'
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
    async handleHubEvent(@Req() req: RawBodyRequest<Request>) {
        if (!req.rawBody) {
            throw new BadRequestException('Invalid body')
        }

        const rawBodyString = req.rawBody.toString('utf-8')

        const hubEventDto: HubEventDto = JSON.parse(addQuotesToNumbers(rawBodyString))

        return await this.eventsService.handleHubEvent(hubEventDto)
    }
}
