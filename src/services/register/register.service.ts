import { Injectable } from '@nestjs/common'
import { AdminsService } from 'src/services/admins/admins.service'
import { SubscriptionsService } from '../subscriptions/subscriptions.service'
import { CreateAdminDto } from '../admins/dto'

@Injectable()
export class RegisterService {
    constructor(
        private readonly adminsService: AdminsService,
        private readonly subscriptionsService: SubscriptionsService
    ) {}

    async createAdmin(createAdminDto: CreateAdminDto) {
        const admin = await this.adminsService.createAdmin(createAdminDto)

        await this.subscriptionsService.createSubscription(admin.id)

        return admin
    }
}
