import { IsNotEmpty, IsString, Length } from 'class-validator'

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    oldPassword: string

    @IsNotEmpty()
    @IsString()
    @Length(6)
    newPassword: string
}
