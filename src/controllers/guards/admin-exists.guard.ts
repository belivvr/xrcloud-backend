import { Injectable } from '@nestjs/common'
import { EntityExistsGuard } from 'src/common'
import { AdminsService } from 'src/services/admins/admins.service'

@Injectable()
export class AdminExistsGuard extends EntityExistsGuard<AdminsService> {
    protected readonly entityName = 'Admin'
    protected readonly entityIdKey = 'adminId'

    constructor(private readonly adminsService: AdminsService) {
        super(adminsService)
    }

    async entityExists(id: string): Promise<boolean> {
        return this.adminsService.adminExists(id)
    }
}
