import { IsNotEmpty, IsNumber, IsOptional, IsString, Max } from 'class-validator'

export class UpdateRoomDto {
    @IsNotEmpty()
    @IsString()
    roomId: string

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsNumber()
    @Max(10)
    size: number
}
