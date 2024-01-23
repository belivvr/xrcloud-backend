import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateNotificationDto {
    @IsNotEmpty()
    @IsString()
    payload: string

    @IsOptional()
    @IsString()
    sceneId?: string

    @IsOptional()
    @IsString()
    roomId?: string
}
