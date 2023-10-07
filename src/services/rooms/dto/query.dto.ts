import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class RoomsQueryDto extends PaginationOptions {
    @IsNotEmpty()
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
