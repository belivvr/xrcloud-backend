import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export enum EventType {
    SCENE_CREATED = 'scene_created',
    SCENE_UPDATED = 'scene_updated',
    ROOM_JOIN = 'room-join',
    ROOM_EXIT = 'room-exit'
}

export class CreateEventDto {
    @IsNotEmpty()
    @IsEnum(EventType)
    type: string

    @IsOptional()
    @IsString()
    projectId: string

    @IsOptional()
    @IsString()
    sceneId: string

    @IsOptional()
    @IsString()
    roomId: string

    @IsOptional()
    @IsString()
    userId: string

    @IsOptional()
    @IsUUID()
    sessionId: string

    @IsOptional()
    @IsString()
    token: string

    @IsOptional()
    @IsString()
    extra: string

    @IsOptional()
    @IsString()
    eventTime: string
}
