import { IsNumber, IsOptional, IsString, Max } from 'class-validator'

export class UpdateRoomDto {
    @IsOptional()
    @IsString()
    userId: string

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsNumber()
    @Max(10)
    size: number
}
