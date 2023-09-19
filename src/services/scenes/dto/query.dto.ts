import { IsNotEmpty, IsUUID } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class ScenesQueryDto extends PaginationOptions {
    @IsNotEmpty()
    @IsUUID()
    projectId: string
}
