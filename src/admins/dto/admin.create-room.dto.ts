import { IsNotEmpty, IsNumber, IsString, IsUUID, Max } from 'class-validator'

export class AdminCreateRoomDto {
    @IsNotEmpty()
    @IsUUID()
    sceneId: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNumber()
    @Max(50)
    size: number
}
