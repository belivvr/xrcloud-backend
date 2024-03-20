import { Logger } from '@nestjs/common'
import * as dotenv from 'dotenv'
import { ConfigException, Path, TypeormLogger, isDevelopment, isProduction } from 'src/common'
import { Admin } from 'src/services/admins/entities'
import { Option } from 'src/services/options/entities'
import { Project } from 'src/services/projects/entities'
import { Room, RoomAccess, RoomActivity } from 'src/services/rooms/entities'
import { Scene } from 'src/services/scenes/entities'
import { Subscription } from 'src/services/subscriptions/entities'
import { Tier } from 'src/services/tiers/entities'
import { User } from 'src/services/users/entities'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { Mig1687757321854 } from './migrations/1687757321854-mig'
import { Mig1687933860267 } from './migrations/1687933860267-mig'
import { Mig1688005419317 } from './migrations/1688005419317-mig'
import { Mig1688633058918 } from './migrations/1688633058918-mig'
import { Mig1689745093072 } from './migrations/1689745093072-mig'
import { Mig1691028245783 } from './migrations/1691028245783-mig'
import { Mig1691050755972 } from './migrations/1691050755972-mig'
import { Mig1691123984351 } from './migrations/1691123984351-mig'
import { Mig1691126254884 } from './migrations/1691126254884-mig'
import { Mig1691560406939 } from './migrations/1691560406939-mig'
import { Mig1691560685487 } from './migrations/1691560685487-mig'
import { Mig1694511062893 } from './migrations/1694511062893-mig'
import { Mig1694676703129 } from './migrations/1694676703129-mig'
import { Mig1694770598959 } from './migrations/1694770598959-mig'
import { Mig1695003851851 } from './migrations/1695003851851-mig'
import { Mig1695003945653 } from './migrations/1695003945653-mig'
import { Mig1695282091685 } from './migrations/1695282091685-mig'
import { Mig1696999381308 } from './migrations/1696999381308-mig'
import { Mig1699335737649 } from './migrations/1699335737649-mig'
import { Mig1699335815108 } from './migrations/1699335815108-mig'
import { Mig1700023892103 } from './migrations/1700023892103-mig'
import { Mig1700038420176 } from './migrations/1700038420176-mig'
import { Mig1700534872626 } from './migrations/1700534872626-mig'
import { Mig1700644851241 } from './migrations/1700644851241-mig'
import { Mig1700679810051 } from './migrations/1700679810051-mig'
import { Mig1700681712529 } from './migrations/1700681712529-mig'
import { Mig1703050330512 } from './migrations/1703050330512-mig'
import { Mig1710920009795 } from './migrations/1710920009795-mig'

dotenv.config()

const entities = [Admin, Project, Scene, Room, Tier, Subscription, Option, RoomAccess, RoomActivity, User]
const migrations = [
    Mig1687757321854,
    Mig1687933860267,
    Mig1688005419317,
    Mig1688633058918,
    Mig1689745093072,
    Mig1691028245783,
    Mig1691050755972,
    Mig1691123984351,
    Mig1691126254884,
    Mig1691560406939,
    Mig1691560685487,
    Mig1694511062893,
    Mig1694676703129,
    Mig1694770598959,
    Mig1695003851851,
    Mig1695003945653,
    Mig1695282091685,
    Mig1696999381308,
    Mig1699335737649,
    Mig1699335815108,
    Mig1700023892103,
    Mig1700038420176,
    Mig1700534872626,
    Mig1700644851241,
    Mig1700679810051,
    Mig1700681712529,
    Mig1703050330512,
    Mig1710920009795
]

type SupportedConnectionOptions = PostgresConnectionOptions

export const typeormOptions = (): SupportedConnectionOptions => {
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
    const allowSchemaReset = Path.isExistsSync('config/@DEV_ALLOW_SCHEMA_RESET')

    if (allowSchemaReset) {
        if (isProduction()) {
            throw new ConfigException(
                'The @DEV_ALLOW_SCHEMA_RESET option should not be set to true in a production environment.'
            )
        }

        // return {
        //     dropSchema: true,
        //     synchronize: true
        // }

        return {
            dropSchema: false,
            synchronize: false
        }
    } else if (isDevelopment()) {
        throw new ConfigException(
            'The @DEV_ALLOW_SCHEMA_RESET option should be set to true in a development environment.'
        )
    }

    return {}
}

export const databaseModuleConfig = (): SupportedConnectionOptions => {
    const logger = new TypeormLogger()
    const poolSize = getPoolSize()

    let options = {
        ...typeormOptions(),
        logger,
        poolSize,
        ...devModeOptions()
    }

    if (options.type === 'postgres') {
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
