import { IsNotEmpty, IsUUID } from 'class-validator'

export class AdminGetModifySceneUrlDto {
    @IsNotEmpty()
    @IsUUID()
    sceneId: string
}
