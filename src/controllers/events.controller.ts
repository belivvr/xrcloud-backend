import { BadRequestException, Body, Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common'
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
    async handleHubEvent(
        @Req() req: RawBodyRequest<Request>,
        @Headers('x-forwarded-for') xForwardedFor: string
    ) {
        if (!req.rawBody) {
            throw new BadRequestException('Invalid body')
        }

        const rawBodyString = req.rawBody.toString('utf-8')

        const hubEventDto: HubEventDto = JSON.parse(addQuotesToNumbers(rawBodyString))
        hubEventDto.ip = xForwardedFor ? xForwardedFor.split(',')[0] : '0.0.0.0'

        return await this.eventsService.handleHubEvent(hubEventDto)
    }
}
