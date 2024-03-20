import { IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateRoomActivityDto {
    @IsOptional()
    @IsUUID()
    roomId: string

    @IsOptional()
    @IsString()
    infraUserId: string
}
