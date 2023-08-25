import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as jwt from 'jsonwebtoken'
import { AdminsService } from 'src/admins/admins.service'
import { Admin } from 'src/admins/entities'
import { CacheService, convertTimeToSeconds, notUsed } from 'src/common'
import { v4 as uuidv4 } from 'uuid'
import { JwtPayload, TokenPayload } from './interfaces'
import { AuthConfigService } from './services'

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => AdminsService))
        private readonly adminsService: AdminsService,
        private readonly jwtService: JwtService,
        private readonly cacheService: CacheService,
        private readonly authConfig: AuthConfigService
    ) {}

    async getAdmin(email: string, password: string): Promise<Admin | null> {
        const admin = await this.adminsService.findAdminByEmail(email)

        if (admin) {
            const valid = await this.adminsService.validateAdmin(password, admin.password)

            if (valid) {
                return admin
            }
        }

        return null
    }

    async login(admin: Admin) {
        const { id: adminId, email } = admin

        const tokenPayload = { adminId, email }

        const tokenPair = await this.generateTokenPair(tokenPayload)

        return tokenPair
    }

    async refreshTokenPair(refreshToken: string) {
        const decoded = this.decodeToken(refreshToken, this.authConfig.refreshSecret)

        if (decoded) {
            const { adminId } = decoded

            if (adminId) {
                const refreshTokenFromStore = await this.getRefreshToken(adminId)

                if (refreshTokenFromStore === refreshToken) {
                    const tokenPair = await this.generateTokenPair(decoded)

                    return tokenPair
                }
            }
        }

        return null
    }

    private async generateTokenPair({ adminId, email }: TokenPayload) {
        const accessToken = this.jwtService.sign(
            { adminId, email, jti: uuidv4() },
            {
                secret: this.authConfig.accessSecret,
                expiresIn: this.authConfig.accessTokenExpiration
            }
        )

        const refreshToken = this.jwtService.sign(
            { adminId, email, jti: uuidv4() },
            {
                secret: this.authConfig.refreshSecret,
                expiresIn: this.authConfig.refreshTokenExpiration
            }
        )

        await this.storeRefreshToken(adminId, refreshToken)

        return { accessToken, refreshToken }
    }

    private decodeToken(token: string, secret: string) {
        try {
            return jwt.verify(token, secret) as JwtPayload
        } catch (error) {
            notUsed('Ignore exceptions raised by unformed tokens')
        }

        return undefined
    }

    private async storeRefreshToken(adminId: string, refreshToken: string) {
        const expireTime = convertTimeToSeconds(this.authConfig.refreshTokenExpiration)

        await this.cacheService.set(`refreshToken:${adminId}`, refreshToken, expireTime)
    }

    private async getRefreshToken(adminId: string): Promise<string | undefined> {
        return this.cacheService.get(`refreshToken:${adminId}`)
    }
}
