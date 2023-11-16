import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateRoomAccessDto {
    @IsNotEmpty()
    @IsString()
    exitedAt: Date
}
