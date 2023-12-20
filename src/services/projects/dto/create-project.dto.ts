import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    label?: string

    @IsOptional()
    @IsUrl()
    webhookUrl?: string
}
