import { IsOptional, IsString } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class GetRoomQueryDto extends PaginationOptions {
    @IsOptional()
    @IsString()
    userId: string
}
