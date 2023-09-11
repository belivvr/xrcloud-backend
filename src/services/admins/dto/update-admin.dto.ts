import { IsNumber, IsOptional } from 'class-validator'

export class UpdateAdminDto {
    @IsOptional()
    @IsNumber()
    subsTierId: number
}
