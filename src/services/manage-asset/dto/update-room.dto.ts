import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class UpdateRoomDto {
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(1000)
    size: number
}
