import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class ScenesQueryDto extends PaginationOptions {
    @IsNotEmpty()
    @IsUUID()
    projectId: string
}

export class GetSceneCreationUrlDto {
    @IsNotEmpty()
    @IsUUID()
    projectId: string

    @IsOptional()
    @IsString()
    creator: string
}

export class GetSceneUpdateUrlDto {
    @IsOptional()
    @IsString()
    creator: string
}
