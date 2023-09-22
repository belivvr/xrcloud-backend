import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common'
import { AdminsService } from 'src/services/admins/admins.service'

@Injectable()
export class UniqueEmailGuard implements CanActivate {
    constructor(private readonly adminsService: AdminsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const email = request.body.email

        const emailExists = await this.adminsService.emailExists(email)

        if (emailExists) {
            throw new ConflictException(`Admin with email ${email} already exists`)
        }

        return true
    }
}
