import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateUserDto {
    @IsNotEmpty()
    @IsUUID()
    projectId: string

    @IsNotEmpty()
    @IsUUID()
    infraUserId: string

    @IsNotEmpty()
    @IsString()
    reticulumId: string
}
