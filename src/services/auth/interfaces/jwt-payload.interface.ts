export interface JwtPayload {
    jti?: string
    adminId: string
    email: string
    iat?: number
    exp?: number
}
