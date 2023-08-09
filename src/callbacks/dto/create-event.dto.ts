import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export enum EventName {
    SCENE_CREATED = 'scene_created',
    SCENE_UPDATED = 'scene_updated'
}

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    token: string

    @IsNotEmpty()
    @IsEnum(EventName)
    eventName: string

    @IsOptional()
    @IsString()
    extra: string

    @IsOptional()
    @IsString()
    projectId: string

    @IsNotEmpty()
    @IsString()
    sceneId: string
}
