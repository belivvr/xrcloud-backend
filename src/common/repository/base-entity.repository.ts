import { DeepPartial, FindOptionsWhere, In, Repository } from 'typeorm'
import { BaseEntity, BaseEntityId } from '.'
import { LogicException } from '../exceptions'
import { PaginationOptions } from '../pagination'

export abstract class BaseEntityRepository<T extends BaseEntity> {
    constructor(protected typeorm: Repository<T>) {}

    createCandidate(entityData: DeepPartial<T>): T {
        if (entityData.id) {
            throw new LogicException('EntityData already has an id')
        }

        const createdEntity = this.typeorm.create(entityData)
        return createdEntity
    }

    async create(entityData: DeepPartial<T>): Promise<T> {
        const createdEntity = this.createCandidate(entityData)
        const savedEntity = await this.typeorm.save(createdEntity)

        return savedEntity
    }

    async update(entity: T): Promise<T> {
        if (!entity.id) {
            throw new LogicException("Entity doesn't have id")
        }

        return this.typeorm.save(entity)
    }

    async remove(entity: T): Promise<void> {
        await this.typeorm.remove(entity)
    }

    async findById(id: BaseEntityId): Promise<T | null> {
        return this.typeorm.findOne({
            where: { id } as FindOptionsWhere<T>
        })
    }

    async findByIds(ids: BaseEntityId[]): Promise<T[]> {
        return this.typeorm.find({
            where: { id: In(ids) } as FindOptionsWhere<T>
        })
    }

    async exist(id: BaseEntityId): Promise<boolean> {
        return this.typeorm.exist({
            where: { id } as FindOptionsWhere<T>
        })
    }

    createQueryBuilder(opts: PaginationOptions = {}): any {
        const { take, skip, orderby } = opts

        const qb = this.typeorm.createQueryBuilder('entity')
        take && qb.take(take)
        skip && qb.skip(skip)

        if (orderby) {
            const order = orderby.direction.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
            qb.orderBy(`entity.${orderby.name}`, order)
        }

        return qb
    }
}
