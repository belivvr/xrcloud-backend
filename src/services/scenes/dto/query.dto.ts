import { IsNotEmpty, IsNotIn, IsOptional, IsString, IsUUID } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class ScenesQueryDto extends PaginationOptions {
    @IsNotEmpty()
    @IsUUID()
    projectId: string

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    creator: string
}

export class GetSceneCreationUrlDto {
    @IsNotEmpty()
    @IsUUID()
    projectId: string

    @IsOptional()
    @IsString()
    @IsNotIn(['admin'])
    creator: string

    @IsOptional()
    @IsString()
    callback: string
}
