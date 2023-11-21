import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export abstract class EntityExistsGuard<T> implements CanActivate {
    protected abstract readonly entityName: string
    protected abstract readonly entityIdKey: string

    constructor(private readonly service: T) {}

    abstract entityExists(id: string): Promise<boolean>

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const entityId =
            request.params[this.entityIdKey] ||
            request.query[this.entityIdKey] ||
            request.body[this.entityIdKey]

        if (!entityId) {
            throw new NotFoundException(`${this.entityName} not provided in the request`)
        }

        const entityExists = await this.entityExists(entityId)

        if (!entityExists) {
            throw new NotFoundException(`${this.entityName} with ID ${entityId} not found`)
        }

        return true
    }
}
