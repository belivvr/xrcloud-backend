import { IsNotEmpty, IsNumber, IsOptional, IsString, Max } from 'class-validator'

export class UpdateRoomDto {
    @IsNotEmpty()
    @IsString()
    personalId: string

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsNumber()
    @Max(10)
    size: number
}
