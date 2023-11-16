import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export enum HubEventName {
    ROOM_JOIN = 'room-join',
    ROOM_EXIT = 'room-exit'
}

export class HubEventDto {
    @IsNotEmpty()
    @IsEnum(HubEventName)
    type: string

    @IsNotEmpty()
    @IsUUID()
    sessionId: string

    @IsNotEmpty()
    @IsString()
    eventTime: string

    @IsOptional()
    @IsString()
    roomId: string

    @IsOptional()
    @IsString()
    userId: string
}
