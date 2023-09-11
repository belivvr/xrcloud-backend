import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class RoomQueryDto extends PaginationOptions {
    @IsNotEmpty()
    @IsUUID()
    sceneId: string
}

export class ApiRoomQueryDto extends PaginationOptions {
    @IsNotEmpty()
    @IsUUID()
    sceneId: string

    @IsOptional()
    @IsString()
    userId: string
}

export class ApiRoomUserQueryDto {
    @IsOptional()
    @IsString()
    userId: string
}
