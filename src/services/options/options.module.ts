import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Option } from './entities'
import { OptionsRepository } from './options.repository'
import { OptionsService } from './options.service'

@Module({
    imports: [TypeOrmModule.forFeature([Option])],
    providers: [OptionsService, OptionsRepository],
    exports: [OptionsService]
})
export class OptionsModule {}
