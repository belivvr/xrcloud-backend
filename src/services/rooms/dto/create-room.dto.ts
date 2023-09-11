import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator'

export class CreateRoomDto {
    @IsNotEmpty()
    @IsUUID()
    projectId: string

    @IsNotEmpty()
    @IsUUID()
    sceneId: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(10)
    size: number
}
