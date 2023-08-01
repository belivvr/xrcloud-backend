import { IsNotEmpty, IsString } from 'class-validator'

export class CreateSceneDto {
    @IsNotEmpty()
    @IsString()
    projectId: string

    @IsNotEmpty()
    @IsString()
    sceneId: string
}
