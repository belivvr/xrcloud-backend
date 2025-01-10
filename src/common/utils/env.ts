export function isProduction(): boolean {
    if (isDevelopment()) {
        return false
    }
    return process.env.NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development'
}
