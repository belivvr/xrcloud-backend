import { IsNotEmpty, IsString } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class QueryDto extends PaginationOptions {}

export class GetSceneUrlDto {
    @IsNotEmpty()
    @IsString()
    personalId: string
}
