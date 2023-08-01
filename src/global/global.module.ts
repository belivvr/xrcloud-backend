import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { CacheModule } from './cache.module'
import { ConfigModule } from './config.module'
import { FiltersModule } from './filters.module'
import { LoggerModule } from './logger.module'
import { ValidationModule } from './validation.module'

@Module({
    imports: [DatabaseModule, ConfigModule, LoggerModule, CacheModule, ValidationModule, FiltersModule]
})
export class GlobalModule {}
