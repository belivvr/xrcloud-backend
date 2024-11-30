import { IsNotEmpty, IsString } from 'class-validator'

export class PrePathUploadAssetDto {
    @IsNotEmpty()
    @IsString()
    prePath: string

    @IsNotEmpty()
    @IsString()
    key: string
}
