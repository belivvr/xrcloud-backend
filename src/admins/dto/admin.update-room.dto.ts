import { IsNotEmpty, IsNumber, IsString, Max } from 'class-validator'

export class AdminUpdateRoomDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNumber()
    @Max(9999)
    size: number
}
