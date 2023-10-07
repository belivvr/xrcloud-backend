import { SetMetadata } from '@nestjs/common'

export const PUBLIC_API_KEY = 'publicApi'
export const PublicApi = () => SetMetadata(PUBLIC_API_KEY, true)
