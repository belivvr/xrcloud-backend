import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateRoomAccessDto {
    @IsNotEmpty()
    @IsString()
    sessionId: string

    @IsNotEmpty()
    @IsString()
    joinedAt: Date

    @IsOptional()
    @IsUUID()
    roomId: string

    @IsOptional()
    @IsString()
    infraUserId: string
}
