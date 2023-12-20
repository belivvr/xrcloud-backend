import { IsOptional, IsString, IsUrl } from 'class-validator'

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    label?: string

    @IsOptional()
    @IsUrl()
    webhookUrl?: string
}
