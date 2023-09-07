import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module'
import { AdminsController } from './admins.controller'
import { AdminsRepository } from './admins.repository'
import { AdminsService } from './admins.service'
import { Admin, OrderAccount } from './entities'
import { OrderAccountRepository } from './order-account.repository'

@Module({
    imports: [TypeOrmModule.forFeature([Admin, OrderAccount]), forwardRef(() => SubscriptionsModule)],
    controllers: [AdminsController],
    providers: [AdminsService, AdminsRepository, OrderAccountRepository],
    exports: [AdminsService]
})
export class AdminsModule {}
