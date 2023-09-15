import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tier } from './entities'
import { TiersRepository } from './tiers.repository'
import { TiersService } from './tiers.service'

@Module({
    imports: [TypeOrmModule.forFeature([Tier])],
    providers: [TiersService, TiersRepository],
    exports: [TiersService]
})
export class TiersModule {}
