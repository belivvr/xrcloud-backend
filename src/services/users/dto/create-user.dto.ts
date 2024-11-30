import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator'

export class CreateUserDto {
    @IsNotEmpty()
    @IsUUID()
    projectId: string

    @IsNotEmpty()
    @IsString()
    reticulumId: string = ''

    @IsOptional()
    @IsString()
    infraUserId: string | null
}
