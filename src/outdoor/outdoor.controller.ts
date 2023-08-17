import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { CreateEventDto } from './dto'
import { OutdoorService } from './outdoor.service'

@Controller('outdoor')
export class OutdoorController {
    constructor(private readonly outdoorService: OutdoorService) {}

    @Post('event')
    @HttpCode(201)
    async createEvent(@Body() createEventDto: CreateEventDto) {
        return
    }

    // @Post('event')
    // async createEvent(@Body() createEventDto: CreateEventDto) {
    //     return await this.outdoorService.createEvent(createEventDto)
    // }

    @Get('option/:optionId')
    async getOption(@Param('optionId') optionId: string) {
        const temp = {
            token: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJyZXQiLCJleHAiOjE2OTk1MTcyODUsImlhdCI6MTY5MjI1OTY4NSwiaXNzIjoicmV0IiwianRpIjoiZjE4MmRhNjMtYzIwZC00NzIxLTgzMjAtNjk0MmRhZTgyMjA5IiwibmJmIjoxNjkyMjU5Njg0LCJzdWIiOiIxNTY0ODY2MjI0NzU0NTI0MTc2IiwidHlwIjoiYWNjZXNzIn0.3WWpeaQClBQWSgPrGDgphFObrLC4kxaNXJTI_yxKdXw3E5y9_qzi6I08TuUAv1Or5npG8gD3OjOOxKhbBZs7GA',
            eventCallback: 'https%3A%2F%2Fvevv-test.vevv.io%3A3300%2Foutdoor%2Fevent',
            extra: 'projectId:f83f4cf2-4b1e-4182-b3bd-de62af3c8c93'
        }

        return temp
    }

    // @Get('option/:optionId')
    // async getOption(@Param('optionId') optionId: string) {
    //     return await this.outdoorService.getOption(optionId)
    // }
}
