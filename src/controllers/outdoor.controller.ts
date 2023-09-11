import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CreateEventDto } from 'src/services/outdoor/dto'
import { OutdoorService } from 'src/services/outdoor/outdoor.service'

@Controller('outdoor')
export class OutdoorController {
    constructor(private readonly outdoorService: OutdoorService) {}

    @Post('event')
    async createEvent(@Body() createEventDto: CreateEventDto) {
        return await this.outdoorService.createEvent(createEventDto)
    }

    @Get('option/:optionId')
    async getOption(@Param('optionId') optionId: string) {
        return await this.outdoorService.getOption(optionId)
    }
}
