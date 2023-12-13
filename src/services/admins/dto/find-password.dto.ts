import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class FindPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    email: string
}
