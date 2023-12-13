import { IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    oldPassword: string

    @IsNotEmpty()
    @IsString()
    @Length(9)
    @Matches(/^(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*()\-=])[\d!@#$%^&*()\-=A-Za-z]{9,}$/, {
        message: 'Invalid password'
    })
    newPassword: string
}
