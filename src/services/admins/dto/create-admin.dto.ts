import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator'

export class CreateAdminDto {
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

    @IsOptional()
    @IsString()
    name?: string = 'name'
}
