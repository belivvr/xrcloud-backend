import { IsNotEmpty, IsNumber, IsString, IsUUID, IsUrl, Max, Min } from 'class-validator'

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

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(1000)
    size: number

    @IsNotEmpty()
    @IsUrl()
    returnUrl: string
}
