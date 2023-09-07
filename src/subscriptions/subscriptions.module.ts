import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminsModule } from 'src/admins/admins.module'
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module'
import { SubsPayment, SubsTier } from './entities'
import { SubsConfigService } from './services'
import { SubsPaymentRepository } from './subs-payment.repository'
import { SubsTierRepository } from './subs-tier.repository'
import { SubscriptionsController } from './subscriptions.controller'
import { SubscriptionsService } from './subscriptions.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([SubsTier, SubsPayment]),
        forwardRef(() => AdminsModule),
        InfrastructureModule
    ],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService, SubsTierRepository, SubsPaymentRepository, SubsConfigService],
    exports: [SubscriptionsService]
})
export class SubscriptionsModule {}
