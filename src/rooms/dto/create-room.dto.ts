import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max } from 'class-validator'

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
    @Max(10)
    size: number
}
