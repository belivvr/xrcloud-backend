import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    label?: string
}
