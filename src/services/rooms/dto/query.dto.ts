import { IsArray, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class RoomsQueryDto extends PaginationOptions {
    @IsOptional()
    @IsString()
    projectId: string

    @IsOptional()
    @IsUUID()
    sceneId: string

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags: string[]

    @IsOptional()
    @IsString()
    userId?: string

    @IsOptional()
    @IsUrl()
    avatarUrl?: string

    @IsOptional()
    @IsString()
    displayName?: string

    @IsOptional()
    @IsString()
    linkPayload?: string
}

export class RoomQueryDto {
    @IsOptional()
    @IsString()
    userId?: string

    @IsOptional()
    @IsUrl()
    avatarUrl?: string

    @IsOptional()
    @IsString()
    displayName?: string

    @IsOptional()
    @IsString()
    linkPayload?: string
}

export class RoomLogsQueryDto {
    @IsOptional()
    @IsString()
    userId?: string
}
