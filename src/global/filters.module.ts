import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ErrorFilter, HttpExceptionFilter } from 'src/common'
import { FatalExceptionFilter } from 'src/common/filters/fatal-exception.filter'
import { InfraModule } from 'src/infra/infra.module'

@Module({
    imports: [InfraModule],
    providers: [
        {
            provide: APP_FILTER,
            useClass: ErrorFilter
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        {
            provide: APP_FILTER,
            useClass: FatalExceptionFilter
        }
    ]
})
export class FiltersModule {}
