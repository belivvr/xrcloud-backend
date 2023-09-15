import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminsModule } from '../admins/admins.module'
import { TiersModule } from '../tiers/tiers.module'
import { Payment } from './entities'
import { PaymentRepository } from './payments.repository'
import { PaymentsService } from './payments.service'

@Module({
    imports: [TypeOrmModule.forFeature([Payment]), AdminsModule, TiersModule],
    providers: [PaymentsService, PaymentRepository],
    exports: [PaymentsService]
})
export class PaymentsModule {}
