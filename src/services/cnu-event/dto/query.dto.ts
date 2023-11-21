import { IsNotEmpty, IsString } from 'class-validator'

export class CnuEventQueryDto {
    @IsNotEmpty()
    @IsString()
    projectLabel: string

    @IsNotEmpty()
    @IsString()
    creator: string
}
