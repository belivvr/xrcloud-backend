import { IsOptional, IsString } from 'class-validator';

export enum LogCode {
    // Room Log Code
    ROOM_JOIN = 'room-join',
    ROOM_EXIT = 'room-exit',
    ROOM_VIDEO_CLICK_EVENT = 'room-video-click-event',

    // Scene Log Code
    SCENE_CREATED = 'scene-created',
    SCENE_UPDATED = 'scene-updated'    
}

export const RoomLogCodes = [
    LogCode.ROOM_JOIN,
    LogCode.ROOM_EXIT,
    LogCode.ROOM_VIDEO_CLICK_EVENT
]

export const SceneLogCodes = [
    LogCode.SCENE_CREATED,
    LogCode.SCENE_UPDATED
]

export enum LogType {
    ROOM = 'room',
    SCENE = 'scene',    
    UNKNOWN = 'unknown'
}


export class LogDto {
    @IsString() // LogCode
    code: string;

    @IsString() // sceneId or roomId
    resourceId: string;    
        
    @IsString()
    sessionId: string;
     
    @IsString()  //hubs ReticulumId(XRCLOUD user id)
    reticulumId: string;  

    @IsString()    
    @IsOptional()   //loggint Time
    logTime?: string;
    
    @IsOptional()
    @IsString()
    action?: string | undefined;
    
    @IsOptional()
    @IsString()
    ip?: string | null;

    @IsOptional()
    @IsString()
    userAgent?: string | null;
    
    @IsOptional()
    @IsString()
    device?: string | null;
}