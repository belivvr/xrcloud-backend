import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { SafeConfigService } from 'src/common'

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            envFilePath: ['.env.' + process.env.NODE_ENV?.toLowerCase()],
            isGlobal: true,
            cache: true
        })
    ],
    providers: [SafeConfigService],
    exports: [SafeConfigService]
})
export class ConfigModule {}
