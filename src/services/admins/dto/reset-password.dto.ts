import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    code: string

    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    email: string

    @IsNotEmpty()
    @IsString()
    @Length(9)
    @Matches(/^(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*()\-=])[\d!@#$%^&*()\-=A-Za-z]{9,}$/, {
        message: 'Invalid password'
    })
    password: string
}
