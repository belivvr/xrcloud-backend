import { IsNotEmpty, IsNumber, IsString, Max } from 'class-validator'

export class AdminCreateRoomDto {
    @IsNotEmpty()
    @IsString()
    sceneId: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNumber()
    @Max(50)
    size: number
}
