import { isEqual } from 'lodash'
import { LogicException } from './exceptions'

export class Assert {
    static equal<T>(a: T, b: T, message?: string) {
        if (!isEqual(a, b)) {
            throw new LogicException(
                `Assert.equal failed: ${JSON.stringify(a)} !== ${JSON.stringify(b)}, ${message ?? ''}`
            )
        }
    }

    static defined(value: any, message: string) {
        if (!value) {
            throw new LogicException(message)
        }
    }
}
