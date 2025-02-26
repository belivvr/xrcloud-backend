export class FatalException extends Error {
    constructor(message?: string) {
        super(message)
        this.name = 'FatalException'
    }
}

// 데이터베이스의 데이터 무결성을 위반한 경우 발생하는 예외입니다.
// export class DataIntegrityException extends FatalException {
//     constructor(message?: string) {
//         super(message)
//         this.name = 'DataIntegrityException'
//     }
// }

// 코드 로직에서 잘못된 상태나 동작에 의해 발생하는 예외입니다. 이는 프로그래머의 실수로 발생하는 경우가 대부분입니다.
export class LogicException extends FatalException {
    constructor(message?: string) {
        super(message)
        this.name = 'LogicException'
    }
}

// 환경 설정에 문제가 있어 발생하는 예외입니다. 전체 시스템에 영향을 주지 않는 예외입니다.
export class ConfigException extends Error {
    constructor(message?: string) {
        super(message)
        this.name = 'ConfigException'
    }
}

// 시스템 환경, OS, 하드웨어 등의 문제로 인해 발생하는 예외입니다.
// export class SystemException extends Error {
//     constructor(message: string) {
//         super(message)
//         this.name = 'SystemException'
//     }
// }

export class TransactionException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'TransactionException'
    }
}
