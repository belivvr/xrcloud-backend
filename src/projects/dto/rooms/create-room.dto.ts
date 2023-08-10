import { IsNotEmpty, IsNumber, IsOptional, IsString, Max } from 'class-validator'

export class CreateRoomDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsNumber()
    @Max(10)
    size: number
}
