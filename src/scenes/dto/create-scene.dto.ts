import { IsNotEmpty, IsString } from 'class-validator'

export class CreateSceneDto {
    @IsNotEmpty()
    @IsString()
    projectId: string

    @IsNotEmpty()
    @IsString()
    infraProjectId: string

    @IsNotEmpty()
    @IsString()
    infraSceneId: string
}
