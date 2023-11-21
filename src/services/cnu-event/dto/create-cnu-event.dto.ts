import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCnuEventDto {
    @IsNotEmpty()
    @IsString()
    creator: string

    @IsNotEmpty()
    @IsString()
    projectId: string

    @IsNotEmpty()
    @IsString()
    sceneId: string
}
