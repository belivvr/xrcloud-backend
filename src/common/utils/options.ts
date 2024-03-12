import * as dotenv from 'dotenv'
import { exit } from 'process'

dotenv.config({ path: '.env' })

export function getString(key: string): string {
    const value = process.env[key]

    if (!value) {
        exit(1)
    }

    return value
}

export const serverOptions = {
    host: getString('HOST')
}
