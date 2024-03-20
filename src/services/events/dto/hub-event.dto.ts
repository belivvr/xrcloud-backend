import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export enum HubEventName {
    ROOM_JOIN = 'room-join',
    ROOM_EXIT = 'room-exit',
    CLICK_EVENT = 'click-event'
}

export class HubEventDto {
    @IsNotEmpty()
    @IsEnum(HubEventName)
    type: string

    @IsNotEmpty()
    @IsString()
    eventTime: string

    @IsOptional()
    @IsUUID()
    sessionId: string

    @IsOptional()
    @IsString()
    roomId: string

    @IsOptional()
    @IsString()
    userId: string

    @IsOptional()
    @IsString()
    eventAction: string

    @IsOptional()
    @IsString()
    ip: string
}
