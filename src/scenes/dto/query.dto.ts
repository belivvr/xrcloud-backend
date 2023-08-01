import { IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class QueryDto extends PaginationOptions {}

export class GetSceneUrlDto {
    @IsNotEmpty()
    @IsString()
    personalId: string
}

export class GetModifySceneUrlDto {
    @IsNotEmpty()
    @IsString()
    personalId: string

    @IsNotEmpty()
    @IsUUID()
    sceneId: string
}
