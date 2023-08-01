import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateSceneDto {
    @IsNotEmpty()
    @IsString()
    sceneId: string
}
