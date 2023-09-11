import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class CreateAdminDto {
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    email: string

    @IsNotEmpty()
    @IsString()
    @Length(6)
    password: string

    @IsOptional()
    @IsString()
    name?: string = 'name'
}
