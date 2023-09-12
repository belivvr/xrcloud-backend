import { IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    oldPassword: string

    @IsNotEmpty()
    @IsString()
    @Length(8)
    @Matches(/^(?=.*\d)(?=.*[!@#$%^&*()])[\d!@#$%^&*()A-Za-z]{8,}$/, {
        message: 'Invalid password'
    })
    newPassword: string
}
