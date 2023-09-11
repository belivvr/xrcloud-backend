import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'

export class HandleWebhookDto {
    @IsNotEmpty()
    @IsNumber()
    timestamp: number

    @IsNotEmpty()
    @IsString()
    version: string

    @IsNotEmpty()
    @IsString()
    event: string

    @IsNotEmpty()
    @IsObject()
    data: object

    @IsOptional()
    @IsBoolean()
    isTest: boolean
}
