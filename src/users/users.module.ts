import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheService } from 'src/common'
import { ReticulumModule } from 'src/reticulum'
import { User } from './entities'
import { UserConfigService } from './services'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

@Module({
    imports: [TypeOrmModule.forFeature([User]), ReticulumModule],
    providers: [UsersService, UsersRepository, CacheService, UserConfigService],
    exports: [UsersService]
})
export class UsersModule {}
