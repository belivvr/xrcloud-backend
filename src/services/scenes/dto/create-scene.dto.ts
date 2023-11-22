import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateSceneDto {
    @IsNotEmpty()
    @IsUUID()
    projectId: string

    @IsNotEmpty()
    @IsString()
    infraProjectId: string

    @IsNotEmpty()
    @IsString()
    infraSceneId: string

    @IsOptional()
    @IsString()
    creator: string
}
