import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class RoomsQueryDto extends PaginationOptions {
    @IsNotEmpty()
    @IsUUID()
    sceneId: string
}

export class ApiRoomsQueryDto extends PaginationOptions {
    @IsNotEmpty()
    @IsUUID()
    sceneId: string

    @IsOptional()
    @IsString()
    userId: string
}

export class ApiRoomQueryDto {
    @IsOptional()
    @IsString()
    userId: string
}
