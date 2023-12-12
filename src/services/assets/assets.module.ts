import { Module } from '@nestjs/common'
import { InfraModule } from 'src/infra/infra.module'
import { AssetsService } from './assets.service'

@Module({
    imports: [InfraModule],
    providers: [AssetsService],
    exports: [AssetsService]
})
export class AssetsModule {}
