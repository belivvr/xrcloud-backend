import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateAdminDto {
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsOptional()
    @IsString()
    name?: string = 'name'
}
