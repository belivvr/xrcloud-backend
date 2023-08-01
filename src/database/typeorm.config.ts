import { Logger } from '@nestjs/common'
import * as dotenv from 'dotenv'
import { Admin } from 'src/admins'
import { ConfigException, Path, TypeormLogger, isDevelopment, isProduction } from 'src/common'
import { Project } from 'src/projects'
import { Room } from 'src/rooms'
import { Scene } from 'src/scenes'
import { User } from 'src/users'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { Mig1687757321854 } from './migrations/1687757321854-mig'
import { Mig1687933860267 } from './migrations/1687933860267-mig'
import { Mig1688005419317 } from './migrations/1688005419317-mig'
import { Mig1688633058918 } from './migrations/1688633058918-mig'
import { Mig1689745093072 } from './migrations/1689745093072-mig'

const entities = [Admin, User, Project, Scene, Room]
const migrations = [Mig1687757321854, Mig1687933860267, Mig1688005419317, Mig1688633058918, Mig1689745093072]

type SupportedConnectionOptions = PostgresConnectionOptions

export const typeormOptions = (): SupportedConnectionOptions => {
    dotenv.config()

    const database = process.env.TYPEORM_DATABASE
    const host = process.env.TYPEORM_HOST
    const port = parseInt(process.env.TYPEORM_PORT ?? 'NaN')
    const username = process.env.TYPEORM_USERNAME
    const password = process.env.TYPEORM_PASSWORD
    const schema = process.env.TYPEORM_SCHEMA

    if (Number.isNaN(port)) {
        throw new ConfigException('TYPEORM_PORT is not a number')
    }

    return {
        type: 'postgres',
        schema,
        database,
        host,
        port,
        username,
        password,
        migrations,
        entities
    }
}

const getPoolSize = () => {
    const poolSize = parseInt(process.env.TYPEORM_POOL_SIZE ?? 'NaN')

    if (Number.isNaN(poolSize)) {
        throw new ConfigException('TYPEORM_POOL_SIZE is not a number')
    }

    return poolSize
}

const devModeOptions = () => {
    const devMode = Path.isExistsSync('@DEV_TYPEORM_AUTO_RESET')

    if (devMode) {
        if (isProduction()) {
            throw new ConfigException(
                'The @DEV_TYPEORM_AUTO_RESET option should not be set to true in a production environment.'
            )
        }

        return {
            dropSchema: true,
            synchronize: true
        }
    } else if (isDevelopment()) {
        throw new ConfigException(
            'The @DEV_TYPEORM_AUTO_RESET option should be set to true in a development environment.'
        )
    }

    return {}
}

export const databaseModuleConfig = (): SupportedConnectionOptions => {
    const logger = new TypeormLogger()
    const poolSize = getPoolSize()

    // devModeOptions가 기존 설정을 덮어쓸 수 있도록 마지막에 와야 한다.
    let options = {
        ...typeormOptions(),
        logger,
        poolSize,
        ...devModeOptions()
    }

    if (options.type === 'postgres') {
        // 설정은 했는데 동작하는 것을 못봤다.
        options = {
            ...options,
            poolErrorHandler: (err: any) => Logger.error('poolErrorHandler', err),
            logNotifications: true
        }
    } else {
        throw new ConfigException(`Unsupported database type: ${options.type}`)
    }

    return options as SupportedConnectionOptions
}
