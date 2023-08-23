import { isEqual } from 'lodash'
import { LogicException } from './exceptions'

export class Assert {
    static deepEquals<T>(a: T, b: T, message: string) {
        if (!isEqual(a, b)) {
            throw new LogicException(`${JSON.stringify(a)} !== ${JSON.stringify(b)}, ${message}`)
        }
    }

    static defined(value: any, message: string) {
        if (!value) {
            throw new LogicException(message)
        }
    }

    static undefined(value: any, message: string) {
        if (value) {
            throw new LogicException(message)
        }
    }

    static truthy(value: any, message: string) {
        if (!value) {
            throw new LogicException(message)
        }
    }

    static falsy(value: any, message: string) {
        if (value) {
            throw new LogicException(message)
        }
    }
}
