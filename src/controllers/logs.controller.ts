import { BadRequestException, Body, Controller, Headers, Post, Req, Logger } from '@nestjs/common'
import { LogDto} from 'src/services/logs/dto'
import { LogsService } from 'src/services/logs/logs.service'

@Controller('logs')
export class LogsController {
    constructor(private readonly logsService: LogsService) {}

    @Post()
    async handleroomLog(
        @Body() logDto: LogDto,
        @Headers('x-forwarded-for') xForwardedFor: string
    ) {
        Logger.log(`Received hub Log: ${logDto}`)

        if (!logDto) {
            Logger.warn('Request body is undefined')
            throw new BadRequestException('Invalid body')
        }

        logDto.ip = xForwardedFor ? xForwardedFor.split(',')[0] : '0.0.0.0'

        return await this.logsService.logging(logDto)
    }
}
