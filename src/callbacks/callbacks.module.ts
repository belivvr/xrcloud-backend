import { Module } from '@nestjs/common'
import { ScenesModule } from 'src/scenes'
import { CallbacksController } from './callbacks.controller'
import { CallbacksService } from './callbacks.service'

@Module({
    imports: [ScenesModule],
    controllers: [CallbacksController],
    providers: [CallbacksService]
})
export class Callbacksmodule {}
