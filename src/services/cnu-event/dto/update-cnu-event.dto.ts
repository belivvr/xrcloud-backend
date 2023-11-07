import { IsOptional, IsString } from 'class-validator'

export class UpdateCnuEventDto {
    @IsOptional()
    @IsString()
    roomId?: string
}
