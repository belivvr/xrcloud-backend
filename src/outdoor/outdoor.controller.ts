import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { CreateEventDto } from './dto'
import { OutdoorService } from './outdoor.service'

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
