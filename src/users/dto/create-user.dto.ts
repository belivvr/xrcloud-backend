import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    personalId: string
    
    @IsNotEmpty()
    @IsString()
    projectId: string
}
