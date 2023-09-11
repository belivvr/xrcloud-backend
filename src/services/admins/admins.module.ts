import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminsRepository } from './admins.repository'
import { AdminsService } from './admins.service'
import { Admin, OrderAccount } from './entities'
import { OrderAccountRepository } from './order-account.repository'

@Module({
    imports: [TypeOrmModule.forFeature([Admin, OrderAccount])],
    providers: [AdminsService, AdminsRepository, OrderAccountRepository],
    exports: [AdminsService]
})
export class AdminsModule {}
