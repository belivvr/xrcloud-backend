import { IsOptional, IsString, IsUUID } from 'class-validator'
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
    userId: string
}

export class RoomQueryDto {
    @IsOptional()
    @IsString()
    userId: string
}

export class RoomAccessQueryDto {
    @IsOptional()
    @IsString()
    userId: string
}
