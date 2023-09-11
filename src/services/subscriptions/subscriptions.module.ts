import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InfraModule } from 'src/infra/infra.module'
import { AdminsModule } from 'src/services/admins/admins.module'
import { SubsPayment, SubsTier } from './entities'
import { SubsConfigService } from './subs-config-service'
import { SubsPaymentRepository } from './subs-payment.repository'
import { SubsTierRepository } from './subs-tier.repository'
import { SubscriptionsService } from './subscriptions.service'

@Module({
    imports: [TypeOrmModule.forFeature([SubsTier, SubsPayment]), InfraModule, AdminsModule],
    providers: [SubscriptionsService, SubsTierRepository, SubsPaymentRepository, SubsConfigService],
    exports: [SubscriptionsService]
})
export class SubscriptionsModule {}
