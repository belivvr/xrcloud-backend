import { IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class QueryDto extends PaginationOptions {}

export class GetSceneCreationUrlDto {
    @IsNotEmpty()
    @IsString()
    personalId: string

    @IsNotEmpty()
    @IsUUID()
    projectId: string
}

export class GetSceneModificationUrlDto {
    @IsNotEmpty()
    @IsString()
    personalId: string

    @IsNotEmpty()
    @IsUUID()
    projectId: string

    @IsNotEmpty()
    @IsUUID()
    sceneId: string
}
