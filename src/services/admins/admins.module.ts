import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InfraModule } from 'src/infra/infra.module'
import { AdminsRepository } from './admins.repository'
import { AdminsService } from './admins.service'
import { Admin } from './entities'
import { AdminConfigService } from './admin-config.service'

@Module({
    imports: [TypeOrmModule.forFeature([Admin]), InfraModule],
    providers: [AdminsService, AdminsRepository, AdminConfigService],
    exports: [AdminsService]
})
export class AdminsModule {}
