import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { RoomAccessType } from '../types'

export class CreateRoomAccessDto {
    @IsNotEmpty()
    @IsString()
    type: RoomAccessType

    @IsNotEmpty()
    @IsString()
    sessionId: string

    @IsNotEmpty()
    @IsString()
    createdAt: Date

    @IsOptional()
    @IsUUID()
    roomId: string

    @IsOptional()
    @IsString()
    infraUserId: string
}
