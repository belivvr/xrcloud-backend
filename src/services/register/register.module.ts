import { Module } from '@nestjs/common'
import { AdminsModule } from '../admins/admins.module'
import { SubscriptionsModule } from '../subscriptions/subscriptions.module'
import { RegisterService } from './register.service'

@Module({
    imports: [AdminsModule, SubscriptionsModule],
    providers: [RegisterService],
    exports: [RegisterService]
})
export class RegisterModule {}
