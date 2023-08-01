import { TypeOrmModule } from '@nestjs/typeorm'
import { ValueTransformer } from 'typeorm'

export function createMemoryTypeormModule() {
    return TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        autoLoadEntities: true
    })
}

export const enumsTransformer = <T>(): ValueTransformer => {
    return {
        to: (value: T[] | null): string | null => {
            if (value == null) {
                return null
            }
            return value.join(',')
        },
        from: (value: string | null): T[] | null => {
            if (value == null) {
                return null
            }
            return value.split(',') as T[]
        }
    }
}
