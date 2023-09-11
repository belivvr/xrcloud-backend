import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SafeConfigService } from 'src/common'
import { AdminsModule } from 'src/services/admins/admins.module'
import { AuthConfigService } from './auth-config.service'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
    imports: [
        AdminsModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: async (configService: SafeConfigService) => {
                const config = new AuthConfigService(configService)

                return {
                    secret: config.accessSecret,
                    signOptions: {
                        expiresIn: config.accessTokenExpiration
                    }
                }
            },
            inject: [SafeConfigService]
        }),
        JwtModule.registerAsync({
            useFactory: async (configService: SafeConfigService) => {
                const config = new AuthConfigService(configService)

                return {
                    secret: config.refreshSecret,
                    signOptions: {
                        expiresIn: config.refreshTokenExpiration
                    }
                }
            },
            inject: [SafeConfigService]
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, AuthConfigService],
    exports: [AuthService]
})
export class AuthModule {}
