import { IsNotEmpty, IsString } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class QueryDto extends PaginationOptions {
    @IsNotEmpty()
    @IsString()
    sceneId: string
}
