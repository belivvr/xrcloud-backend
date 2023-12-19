import { createHash, randomBytes, randomUUID } from 'crypto'
import { LogicException } from '../exceptions'
import { Coordinate } from '../types'

export async function sleep(timeout: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, timeout))
}

export function generateUUID() {
    return randomUUID()
}

export function updateIntersection<T extends object>(obj1: T, obj2: any): T {
    const updatedObject = Object.keys(obj2).reduce(
        (updated, key) => {
            if (key in updated) {
                updated[key as keyof T] = obj2[key]
            }
            return updated
        },
        { ...obj1 }
    )

    return updatedObject
}

export function convertTimeToSeconds(timeString: string): number {
    const matches = timeString.match(/(\d+)\s*(s|m|h|d)?/g)

    if (!matches) {
        throw new Error('Invalid time string')
    }

    const times = matches.map((match) => {
        const [_, value, unit] = match.match(/(\d+)\s*(s|m|h|d)?/) as any
        let multiplier = 1

        switch (unit) {
            case 's':
                multiplier = 1
                break
            case 'm':
                multiplier = 60
                break
            case 'h':
                multiplier = 3600
                break
            case 'd':
                multiplier = 86400
                break
            /* istanbul ignore next */
            default:
                throw new LogicException("Invalid time unit. It should be one of 's', 'm', 'h', 'd'")
        }

        return parseInt(value) * multiplier
    })

    return times.reduce((prev, curr) => prev + curr, 0)
}

export function notUsed(_message?: string) {}

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex')

    const hashedPassword: string = createHash('sha256')
        .update(password + salt)
        .digest('hex')

    return `${salt}:${hashedPassword}`
}

export async function validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const [salt, originalHash] = hashedPassword.split(':')

    const newHash = createHash('sha256')
        .update(plainPassword + salt)
        .digest('hex')

    return newHash === originalHash
}

export function addQuotesToNumbers(text: string) {
    return text.replace(/:(\s*)(\d+)(\s*[,\}])/g, ':"$2"$3')
}

export function coordinateDistanceInMeters(coord1: Coordinate, coord2: Coordinate) {
    const toRad = (degree: number) => degree * (Math.PI / 180)
    const R = 6371000 // earth radius in meters

    const lat1 = toRad(coord1.latitude)
    const lon1 = toRad(coord1.longitude)
    const lat2 = toRad(coord2.latitude)
    const lon2 = toRad(coord2.longitude)

    const dLat = lat2 - lat1
    const dLon = lon2 - lon1

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // distance in meters
}

export function equalsIgnoreCase(str1: any, str2: any): boolean {
    if (typeof str1 === 'string' && typeof str2 === 'string') {
        return str1.toLowerCase() === str2.toLowerCase()
    }

    return false
}

export function makeApikey() {
    const data = generateUUID()

    const apiKey: string = createHash('sha256').update(data).digest('hex')

    return apiKey
}

export function getSlug(url: string): string {
    const splitUrl = url.split('/')
    const slug = splitUrl[splitUrl.length - 1]

    return slug
}

export function toBoolean(value: string): boolean {
    if (typeof value === 'boolean') {
        return value
    }

    if (typeof value === 'string') {
        return value.toLowerCase() === 'true'
    }

    throw new Error('Value must be a boolean or a string representing a boolean')
}

export function getServerDate() {
    const serverDate = new Date()

    return serverDate.toISOString().replace('T', ' ').substring(0, 19)
}
