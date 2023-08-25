import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AdminsModule } from 'src/admins/admins.module'
import { SafeConfigService } from 'src/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthConfigService } from './services'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
    imports: [
        forwardRef(() => AdminsModule),
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
    controllers: [AuthController]
})
export class AuthModule {}
